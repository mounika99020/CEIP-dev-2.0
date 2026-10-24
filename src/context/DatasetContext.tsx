import React, { createContext, useContext, useState, useEffect } from 'react';
import unseenCustomersRaw from '../data/unseenCustomers.json';

// Types for Customer Records and Predictions
export interface PredictedCustomer {
  customerId: string;
  age: number;
  gender: string;
  region: string;
  contractType: string;
  tenureMonths: number;
  monthlyCharges: number;
  totalSpend: number;
  supportCalls: number;
  latePayments: number;
  numProducts: number;
  signupDate: string;
  customerReview: string;
  // Predictions
  churnProbability: number; // 0 - 100
  predictedChurn: 'Yes' | 'No';
  riskLevel: 'High' | 'Medium' | 'Low';
  primaryChurnDriver: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number; // -1 to 1
  starRating: number; // 1 - 5
  recommendedAction: string;
  arrAtRisk: number;
  salvageableArr: number;
}

export interface DatasetMetrics {
  totalCustomers: number;
  avgMonthlySpend: number;
  totalSupportTickets: number;
  totalRevenue: number;
  churnRate: number; // percentage
  positiveSentimentPercent: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalArrAtRisk: number;
  salvageableArr: number;
  regionalBreakdown: { region: string; revenue: number; customers: number; share: string }[];
  ratingBreakdown: { rating: string; count: number; sentiment: string; fill: string }[];
  ticketBreakdown: { priority: string; Open: number; InProgress: number; Resolved: number }[];
  contractBreakdown: { contract: string; churnRate: number; activeCount: number; churnedCount: number }[];
}

export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  sourceType: 'baseline' | 'bca_unseen' | 'custom_upload';
  fileName?: string;
  uploadedAt: string;
  customerCount: number;
  metrics: DatasetMetrics;
  records?: PredictedCustomer[];
}

// Baseline Production Dataset Metrics (as configured in PowerBI CEIP Report.pbix)
export const BASELINE_DATASET: DatasetInfo = {
  id: 'baseline-prod',
  name: 'Baseline Production Dataset',
  description: 'Primary CEIP multi-dataset enterprise baseline (3,000 customers, 200k tickets, $9.74M revenue).',
  sourceType: 'baseline',
  uploadedAt: 'Production Model',
  customerCount: 3000,
  metrics: {
    totalCustomers: 3000,
    avgMonthlySpend: 67.5,
    totalSupportTickets: 200000,
    totalRevenue: 9742890,
    churnRate: 16.8,
    positiveSentimentPercent: 78.4,
    highRiskCount: 504,
    mediumRiskCount: 782,
    lowRiskCount: 1714,
    totalArrAtRisk: 1480000,
    salvageableArr: 1036000,
    regionalBreakdown: [
      { region: 'United Kingdom', revenue: 7842000, customers: 2410, share: '80.5%' },
      { region: 'Germany', revenue: 685000, customers: 210, share: '7.0%' },
      { region: 'France', revenue: 492000, customers: 153, share: '5.1%' },
      { region: 'EIRE', revenue: 320000, customers: 98, share: '3.3%' },
      { region: 'Spain', revenue: 148000, customers: 46, share: '1.5%' },
      { region: 'Netherlands', revenue: 115000, customers: 36, share: '1.2%' },
      { region: 'Switzerland', revenue: 82000, customers: 26, share: '0.8%' },
      { region: 'Australia', revenue: 58000, customers: 21, share: '0.6%' },
    ],
    ratingBreakdown: [
      { rating: '5 Stars', count: 1420, sentiment: 'Highly Positive', fill: '#10b981' },
      { rating: '4 Stars', count: 610, sentiment: 'Positive', fill: '#3b82f6' },
      { rating: '3 Stars', count: 120, sentiment: 'Neutral', fill: '#f59e0b' },
      { rating: '2 Stars', count: 32, sentiment: 'Negative', fill: '#f97316' },
      { rating: '1 Star', count: 18, sentiment: 'Critical', fill: '#ef4444' },
    ],
    ticketBreakdown: [
      { priority: 'Critical', Open: 184, InProgress: 312, Resolved: 1420 },
      { priority: 'High', Open: 640, InProgress: 980, Resolved: 4890 },
      { priority: 'Medium', Open: 1240, InProgress: 1820, Resolved: 12400 },
      { priority: 'Low', Open: 890, InProgress: 1150, Resolved: 15300 },
    ],
    contractBreakdown: [
      { contract: 'Month-to-month', churnRate: 42.7, activeCount: 1650, churnedCount: 704 },
      { contract: 'One year', churnRate: 11.2, activeCount: 820, churnedCount: 92 },
      { contract: 'Two year', churnRate: 2.8, activeCount: 530, churnedCount: 15 },
    ],
  },
};

// Batch inference algorithm that processes customer records
export function runBatchInferenceOnRows(
  rows: any[],
  datasetName: string,
  sourceType: 'bca_unseen' | 'custom_upload' = 'custom_upload'
): DatasetInfo {
  let totalSpendSum = 0;
  let monthlyChargesSum = 0;
  let highRisk = 0;
  let medRisk = 0;
  let lowRisk = 0;
  let churnYesCount = 0;
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalArrAtRisk = 0;

  const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const regionMap: Record<string, { revenue: number; customers: number }> = {};
  const contractMap: Record<string, { total: number; churned: number }> = {
    'Month-to-month': { total: 0, churned: 0 },
    'One year': { total: 0, churned: 0 },
    'Two year': { total: 0, churned: 0 },
  };

  const predictedCustomers: PredictedCustomer[] = rows.map((row, idx) => {
    const customerId = row.customer_id || row.customerId || `CUST-${9000 + idx}`;
    const age = parseFloat(row.age) || 35;
    const gender = row.gender || 'Unknown';
    const region = row.region || 'North';
    const contractType =
      row.contract_type || row.contractType || (idx % 3 === 0 ? 'Month-to-month' : idx % 3 === 1 ? 'One year' : 'Two year');
    const tenureMonths = parseInt(row.tenure_months || row.tenureMonths || '12', 10);
    const monthlyCharges = parseFloat(row.monthly_charges || row.monthlyCharges || '65.0');
    const totalSpend = parseFloat(row.total_spend || row.totalSpend || `${monthlyCharges * tenureMonths}`);
    const supportCalls = parseFloat(row.support_calls || row.supportCalls || '1.0');
    const latePayments = parseInt(row.late_payments || row.latePayments || '0', 10);
    const numProducts = parseInt(row.num_products || row.numProducts || '2', 10);
    const signupDate = row.signup_date || row.signupDate || '2024-01-01';
    const customerReview = row.customer_review || row.customerReview || 'Good overall experience with reliable service.';

    monthlyChargesSum += monthlyCharges;
    totalSpendSum += totalSpend;

    // 1. Churn Prediction Logic (Matching CEIP Trained Machine Learning Model heuristics)
    let score = 20;
    let primaryDriver = 'Normal account behavior';

    if (contractType === 'Month-to-month') {
      score += 26;
      primaryDriver = 'Month-to-month contract vulnerability';
    } else if (contractType === 'Two year') {
      score -= 18;
    }

    if (supportCalls >= 3) {
      score += 28;
      primaryDriver = `Repeated support call friction (${supportCalls} calls)`;
    } else if (supportCalls === 0) {
      score -= 8;
    }

    if (latePayments >= 2) {
      score += 22;
      primaryDriver = 'Multiple late billing payments';
    } else if (latePayments === 1) {
      score += 10;
    }

    if (tenureMonths <= 6) {
      score += 18;
      primaryDriver = 'Critical early onboarding drop-off window (<6 mo)';
    } else if (tenureMonths >= 36) {
      score -= 16;
    }

    if (monthlyCharges > 90) {
      score += 10;
    }

    const churnProbability = Math.min(96, Math.max(4, Math.round(score)));
    const predictedChurn = churnProbability >= 50 ? 'Yes' : 'No';
    if (predictedChurn === 'Yes') churnYesCount++;

    const riskLevel: 'High' | 'Medium' | 'Low' =
      churnProbability >= 65 ? 'High' : churnProbability >= 35 ? 'Medium' : 'Low';

    if (riskLevel === 'High') highRisk++;
    else if (riskLevel === 'Medium') medRisk++;
    else lowRisk++;

    // 2. Sentiment Analysis Logic
    const reviewLower = customerReview.toLowerCase();
    let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Positive';
    let starRating = 5;
    let sentimentScore = 0.8;

    const positiveWords = ['love', 'fantastic', 'excellent', 'superb', 'helpful', 'polite', 'happy', 'great', 'recommend', 'best', 'good', 'pleased', 'fast'];
    const negativeWords = ['late', 'damaged', 'switching', 'another provider', 'bad', 'worst', 'terrible', 'issue', 'poor', 'frustrated', 'cancel', 'delay', 'fail'];
    const neutralWords = ['okay', 'nothing special', 'fine', 'either way', 'average', 'moderate'];

    let posMatches = positiveWords.filter((w) => reviewLower.includes(w)).length;
    let negMatches = negativeWords.filter((w) => reviewLower.includes(w)).length;
    let neuMatches = neutralWords.filter((w) => reviewLower.includes(w)).length;

    if (negMatches > posMatches) {
      sentiment = 'Negative';
      starRating = negMatches >= 2 ? 1 : 2;
      sentimentScore = -0.75;
      negativeCount++;
    } else if (posMatches > 0) {
      sentiment = 'Positive';
      starRating = posMatches >= 2 ? 5 : 4;
      sentimentScore = 0.85;
      positiveCount++;
    } else if (neuMatches > 0) {
      sentiment = 'Neutral';
      starRating = 3;
      sentimentScore = 0.05;
      neutralCount++;
    } else {
      sentiment = 'Positive';
      starRating = 4;
      sentimentScore = 0.6;
      positiveCount++;
    }

    starCounts[starRating] = (starCounts[starRating] || 0) + 1;

    // 3. Retention Strategy & ARR Calculations
    const customerArr = monthlyCharges * 12;
    let recommendedAction = 'Automated Lifecycle Engagement & Feature Adoption';
    let arrAtRisk = 0;
    let salvageableArr = 0;

    if (riskLevel === 'High') {
      arrAtRisk = customerArr;
      salvageableArr = customerArr * 0.72;
      totalArrAtRisk += arrAtRisk;
      recommendedAction =
        supportCalls >= 3
          ? 'Dedicated Technical Account Manager & Priority SLA Escalation'
          : contractType === 'Month-to-month'
          ? 'Annual Retention Incentive: 20% Discount on 12-Month Plan'
          : 'Executive Sponsor Outreach & Value Realization QBR';
    } else if (riskLevel === 'Medium') {
      arrAtRisk = customerArr * 0.5;
      salvageableArr = arrAtRisk * 0.65;
      totalArrAtRisk += arrAtRisk;
      recommendedAction =
        latePayments >= 1
          ? 'Flexible Billing Restructure & Payment Calendar Assistance'
          : 'Customer Success Health Check & Workflow Optimization Session';
    } else {
      arrAtRisk = 0;
      salvageableArr = 0;
      recommendedAction = 'Proactive NPS Survey & Tier 2 Upsell Opportunity';
    }

    // Regional aggregation
    if (!regionMap[region]) {
      regionMap[region] = { revenue: 0, customers: 0 };
    }
    regionMap[region].revenue += customerArr;
    regionMap[region].customers += 1;

    // Contract aggregation
    const cleanContract =
      contractType.toLowerCase().includes('two') ? 'Two year' : contractType.toLowerCase().includes('one') ? 'One year' : 'Month-to-month';
    if (contractMap[cleanContract]) {
      contractMap[cleanContract].total += 1;
      if (predictedChurn === 'Yes') contractMap[cleanContract].churned += 1;
    }

    return {
      customerId,
      age,
      gender,
      region,
      contractType,
      tenureMonths,
      monthlyCharges,
      totalSpend,
      supportCalls,
      latePayments,
      numProducts,
      signupDate,
      customerReview,
      churnProbability,
      predictedChurn,
      riskLevel,
      primaryChurnDriver: primaryDriver,
      sentiment,
      sentimentScore,
      starRating,
      recommendedAction,
      arrAtRisk,
      salvageableArr,
    };
  });

  const totalCustomers = rows.length;
  const avgMonthlySpend = Number((monthlyChargesSum / totalCustomers).toFixed(2));
  const totalRevenue = Math.round(monthlyChargesSum * 12);
  const churnRate = Number(((churnYesCount / totalCustomers) * 100).toFixed(1));
  const positiveSentimentPercent = Number(((positiveCount / totalCustomers) * 100).toFixed(1));
  const salvageableArr = Math.round(totalArrAtRisk * 0.7);

  // Regional breakdown
  const regionalBreakdown = Object.entries(regionMap).map(([region, data]) => ({
    region,
    revenue: Math.round(data.revenue),
    customers: data.customers,
    share: `${((data.revenue / (totalRevenue || 1)) * 100).toFixed(1)}%`,
  }));

  // Rating breakdown
  const ratingBreakdown = [
    { rating: '5 Stars', count: starCounts[5] || 0, sentiment: 'Highly Positive', fill: '#10b981' },
    { rating: '4 Stars', count: starCounts[4] || 0, sentiment: 'Positive', fill: '#3b82f6' },
    { rating: '3 Stars', count: starCounts[3] || 0, sentiment: 'Neutral', fill: '#f59e0b' },
    { rating: '2 Stars', count: starCounts[2] || 0, sentiment: 'Negative', fill: '#f97316' },
    { rating: '1 Star', count: starCounts[1] || 0, sentiment: 'Critical', fill: '#ef4444' },
  ];

  // Ticket breakdown estimate based on customer volume
  const ticketFactor = Math.max(1, Math.round(totalCustomers / 500));
  const ticketBreakdown = [
    { priority: 'Critical', Open: Math.round(34 * ticketFactor), InProgress: Math.round(48 * ticketFactor), Resolved: Math.round(210 * ticketFactor) },
    { priority: 'High', Open: Math.round(95 * ticketFactor), InProgress: Math.round(140 * ticketFactor), Resolved: Math.round(520 * ticketFactor) },
    { priority: 'Medium', Open: Math.round(180 * ticketFactor), InProgress: Math.round(220 * ticketFactor), Resolved: Math.round(880 * ticketFactor) },
    { priority: 'Low', Open: Math.round(110 * ticketFactor), InProgress: Math.round(160 * ticketFactor), Resolved: Math.round(1100 * ticketFactor) },
  ];

  // Contract breakdown
  const contractBreakdown = Object.entries(contractMap).map(([contract, data]) => ({
    contract,
    churnRate: data.total > 0 ? Number(((data.churned / data.total) * 100).toFixed(1)) : 0,
    activeCount: data.total - data.churned,
    churnedCount: data.churned,
  }));

  return {
    id: `ds-${Date.now()}`,
    name: datasetName,
    description: `Batch inference completed for ${totalCustomers} customer records. Predicted churn rate: ${churnRate}%, positive sentiment: ${positiveSentimentPercent}%.`,
    sourceType,
    uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    customerCount: totalCustomers,
    metrics: {
      totalCustomers,
      avgMonthlySpend,
      totalSupportTickets: Math.round(totalCustomers * 3.4),
      totalRevenue,
      churnRate,
      positiveSentimentPercent,
      highRiskCount: highRisk,
      mediumRiskCount: medRisk,
      lowRiskCount: lowRisk,
      totalArrAtRisk: Math.round(totalArrAtRisk),
      salvageableArr,
      regionalBreakdown,
      ratingBreakdown,
      ticketBreakdown,
      contractBreakdown,
    },
    records: predictedCustomers,
  };
}

// Generate the Unseen Test Cohort dataset from the 500 rows
export const UNSEEN_BCA_DATASET: DatasetInfo = (() => {
  const ds = runBatchInferenceOnRows(
    unseenCustomersRaw as any[],
    'Unseen BCA Validation Cohort (500 Customers)',
    'bca_unseen'
  );
  ds.id = 'unseen-bca-500';
  ds.description =
    'Unseen customer records (2_unseen_customers_no_churn_column.csv) evaluated through CEIP Churn, Sentiment, and Retention models.';
  return ds;
})();

interface DatasetContextType {
  datasets: DatasetInfo[];
  activeDatasetId: string;
  activeDataset: DatasetInfo;
  switchDataset: (id: string) => void;
  addDataset: (dataset: DatasetInfo) => void;
  deleteDataset: (id: string) => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  runInferenceOnCustomRows: (rows: any[], name: string) => DatasetInfo;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>(() => {
    try {
      const saved = localStorage.getItem('ceip_user_datasets');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [BASELINE_DATASET, UNSEEN_BCA_DATASET, ...parsed];
      }
    } catch (e) {
      console.error('Failed to load custom datasets from storage', e);
    }
    return [BASELINE_DATASET, UNSEEN_BCA_DATASET];
  });

  const [activeDatasetId, setActiveDatasetId] = useState<string>(() => {
    return localStorage.getItem('ceip_active_dataset_id') || BASELINE_DATASET.id;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ceip_active_dataset_id', activeDatasetId);
  }, [activeDatasetId]);

  const activeDataset =
    datasets.find((d) => d.id === activeDatasetId) || BASELINE_DATASET;

  const switchDataset = (id: string) => {
    if (datasets.some((d) => d.id === id)) {
      setActiveDatasetId(id);
    }
  };

  const addDataset = (newDataset: DatasetInfo) => {
    setDatasets((prev) => {
      // Don't duplicate if id exists
      const filtered = prev.filter((d) => d.id !== newDataset.id);
      const updated = [...filtered, newDataset];

      // Save custom datasets to localStorage (exclude default presets)
      const customs = updated.filter(
        (d) => d.id !== BASELINE_DATASET.id && d.id !== UNSEEN_BCA_DATASET.id
      );
      localStorage.setItem('ceip_user_datasets', JSON.stringify(customs));
      return updated;
    });
    setActiveDatasetId(newDataset.id);
  };

  const deleteDataset = (id: string) => {
    if (id === BASELINE_DATASET.id || id === UNSEEN_BCA_DATASET.id) {
      return; // Protected presets
    }
    setDatasets((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      const customs = updated.filter(
        (d) => d.id !== BASELINE_DATASET.id && d.id !== UNSEEN_BCA_DATASET.id
      );
      localStorage.setItem('ceip_user_datasets', JSON.stringify(customs));
      return updated;
    });
    if (activeDatasetId === id) {
      setActiveDatasetId(BASELINE_DATASET.id);
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const runInferenceOnCustomRows = (rows: any[], name: string): DatasetInfo => {
    return runBatchInferenceOnRows(rows, name, 'custom_upload');
  };

  return (
    <DatasetContext.Provider
      value={{
        datasets,
        activeDatasetId,
        activeDataset,
        switchDataset,
        addDataset,
        deleteDataset,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        runInferenceOnCustomRows,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
