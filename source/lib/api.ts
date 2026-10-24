// CEIP API Client Layer
// Isolated API functions for future FastAPI and saved ML model integrations.
// All functions fall back gracefully to structured demo responses when the backend is offline.

import {
  DEMO_CX_CUSTOMERS,
  DEMO_AI_RESPONSES,
} from '../data/demoData';

export const API_BASE_URL =
  ((import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) ||
  'http://localhost:8000';

export interface ChurnPredictionRequest {
  customerId?: string;
  age: number;
  subscriptionDuration: number;
  contractType: string;
  monthlyLogins: number;
  lastPurchaseDaysAgo: number;
  appUsageTime: number;
  monthlySpend: number;
  discountUsagePercentage: number;
  customerSupportCalls: number;
}

export interface ChurnPredictionResponse {
  customerId?: string;
  churnRisk: number; // e.g. 78 (%)
  churnProbability: number; // e.g. 0.78
  riskLevel: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  primaryDrivers: string[];
  recommendedPlaybook: string;
  isDemoResult?: boolean;
}

export interface SentimentAnalysisRequest {
  text: string;
  customerId?: string;
}

export interface SentimentAnalysisResponse {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number; // e.g. 0.94
  insight: string;
  keyPhrases: string[];
  aspects: {
    category: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
  }[];
  isDemoResult?: boolean;
}

export interface RetentionRecommendationRequest {
  customerId: string;
  customerRisk: string;
  engagementInformation: string;
  contractInformation: string;
  monthlySpend: number;
  customerSupportCalls: number;
}

export interface RetentionRecommendationResponse {
  customerId: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  customerSegment: string;
  recommendedAction: string;
  retentionOpportunity: string;
  estimatedArrProtected: number;
  suggestedTimeline: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  isDemoResult?: boolean;
}

export interface SearchCustomerResult {
  id: string;
  accountName: string;
  segment: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  contractType: string;
  monthlySpend: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Predict customer churn using saved ML models via FastAPI POST /api/churn/predict
 */
export async function predictChurn(
  payload: ChurnPredictionRequest
): Promise<ChurnPredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/churn/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return { ...data, isDemoResult: false };
    }
  } catch (err) {
    // Backend not connected yet - fall through to structured demo response
    console.info('[CEIP API] Backend unavailable, returning structured demo prediction response.');
  }

  // Structured demo response for frontend preview
  // Note: Model calculations will be executed by FastAPI backend
  const calculatedRisk = Math.min(
    95,
    Math.max(
      8,
      Math.round(
        (payload.customerSupportCalls * 8) +
        (payload.lastPurchaseDaysAgo * 0.9) -
        (payload.monthlyLogins * 0.7) +
        (payload.discountUsagePercentage * 0.4) +
        (payload.contractType === 'Monthly' ? 20 : 5)
      )
    )
  );

  const riskLevel: 'High' | 'Medium' | 'Low' =
    calculatedRisk >= 70 ? 'High' : calculatedRisk >= 40 ? 'Medium' : 'Low';

  const primaryDrivers: string[] = [];
  if (payload.customerSupportCalls >= 4) {
    primaryDrivers.push(`High support escalation volume (${payload.customerSupportCalls} tickets)`);
  }
  if (payload.lastPurchaseDaysAgo >= 20) {
    primaryDrivers.push(`Extended inactivity (${payload.lastPurchaseDaysAgo} days since transaction)`);
  }
  if (payload.contractType === 'Monthly') {
    primaryDrivers.push('Flexible month-to-month contract tier');
  }
  if (payload.discountUsagePercentage >= 30) {
    primaryDrivers.push(`Discount elasticity dependency (${payload.discountUsagePercentage}%)`);
  }
  if (primaryDrivers.length === 0) {
    primaryDrivers.push('Consistent session cadence and low friction metrics');
  }

  return {
    customerId: payload.customerId || 'CUST-DEMO',
    churnRisk: calculatedRisk,
    churnProbability: Number((calculatedRisk / 100).toFixed(2)),
    riskLevel,
    confidenceScore: 0.92,
    primaryDrivers,
    recommendedPlaybook:
      riskLevel === 'High'
        ? 'Immediate Executive Sponsor Outreach & SLA Audit'
        : riskLevel === 'Medium'
        ? 'Customer Success Proactive Value Check-In'
        : 'Automated Lifecycle Engagement & Upsell Path',
    isDemoResult: true,
  };
}

/**
 * Analyze customer feedback sentiment via FastAPI POST /api/sentiment/analyze
 */
export async function analyzeSentiment(
  payload: SentimentAnalysisRequest
): Promise<SentimentAnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sentiment/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return { ...data, isDemoResult: false };
    }
  } catch (err) {
    console.info('[CEIP API] Backend unavailable, returning structured demo sentiment response.');
  }

  // Structured demo response for frontend preview
  const lower = payload.text.toLowerCase();
  const isNeg =
    lower.includes('fail') ||
    lower.includes('slow') ||
    lower.includes('frustrated') ||
    lower.includes('timeout') ||
    lower.includes('dispute') ||
    lower.includes('bad') ||
    lower.includes('worst') ||
    lower.includes('issue') ||
    lower.includes('cancel');

  const isPos =
    lower.includes('great') ||
    lower.includes('saved') ||
    lower.includes('smooth') ||
    lower.includes('love') ||
    lower.includes('exceptional') ||
    lower.includes('satisfied') ||
    lower.includes('recommend') ||
    lower.includes('fast');

  const sentiment: 'Positive' | 'Neutral' | 'Negative' = isNeg
    ? 'Negative'
    : isPos
    ? 'Positive'
    : 'Neutral';

  return {
    sentiment,
    confidence: isNeg ? 0.94 : isPos ? 0.96 : 0.81,
    insight:
      sentiment === 'Negative'
        ? 'Identified friction in system reliability and response speed. High urgency for customer success follow-up.'
        : sentiment === 'Positive'
        ? 'Customer expresses strong satisfaction with platform capabilities and time savings.'
        : 'Feedback is informational or neutral regarding features and workflow options.',
    keyPhrases: payload.text
      .split(/[.,!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5)
      .slice(0, 3),
    aspects: [
      {
        category: 'Usability & Performance',
        sentiment,
      },
      {
        category: 'Customer Support',
        sentiment: sentiment === 'Negative' ? 'Negative' : 'Neutral',
      },
    ],
    isDemoResult: true,
  };
}

/**
 * Generate retention recommendation via FastAPI POST /api/retention/recommend
 */
export async function generateRetentionRecommendation(
  payload: RetentionRecommendationRequest
): Promise<RetentionRecommendationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/retention/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return { ...data, isDemoResult: false };
    }
  } catch (err) {
    console.info('[CEIP API] Backend unavailable, returning structured demo retention response.');
  }

  // Structured demo response for frontend preview
  const isHigh = payload.customerRisk.toLowerCase().includes('high') || payload.customerSupportCalls >= 5;
  const isMedium = payload.customerRisk.toLowerCase().includes('med') || payload.customerSupportCalls >= 3;

  const riskLevel: 'High' | 'Medium' | 'Low' = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';
  const priority: 'Critical' | 'High' | 'Medium' | 'Low' = isHigh ? 'Critical' : isMedium ? 'High' : 'Low';

  const segment =
    payload.monthlySpend >= 8000
      ? 'Enterprise'
      : payload.monthlySpend >= 3000
      ? 'Mid-Market'
      : 'Growth';

  return {
    customerId: payload.customerId || 'CUST-DEMO',
    riskLevel,
    customerSegment: segment,
    recommendedAction:
      isHigh
        ? 'Initiate Executive Sponsor Outreach & Senior Technical Support SLA Review'
        : isMedium
        ? 'Schedule Customer Success Strategy Consultation & Feature Review'
        : 'Enroll in Automated Lifecycle Product Adoption Training',
    retentionOpportunity:
      isHigh
        ? 'Salvage high-risk contract prior to quarter renewal window'
        : 'Deepen feature adoption to transition to multi-year commitment',
    estimatedArrProtected: payload.monthlySpend * 12,
    suggestedTimeline: isHigh ? 'Within 48 hours' : 'Within 5 business days',
    priority,
    isDemoResult: true,
  };
}

/**
 * Search customers across local cache or FastAPI GET /api/customers/search?q=...
 */
export async function searchCustomers(
  query: string
): Promise<SearchCustomerResult[]> {
  if (!query || query.trim() === '') return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/customers/search?q=${encodeURIComponent(query)}`
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Fall back to searching demo list
  }

  const q = query.toLowerCase();
  return DEMO_CX_CUSTOMERS.filter(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.accountName.toLowerCase().includes(q) ||
      c.segment.toLowerCase().includes(q) ||
      c.riskLevel.toLowerCase().includes(q)
  ).map((c) => ({
    id: c.id,
    accountName: c.accountName,
    segment: c.segment,
    riskLevel: c.riskLevel,
    contractType: c.contractType,
    monthlySpend: c.monthlySpend,
  }));
}

/**
 * Send AI Assistant chat query via FastAPI POST /api/assistant/chat
 */
export async function sendChatMessage(
  message: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.response;
    }
  } catch (err) {
    console.info('[CEIP API] Assistant backend offline, generating intelligent demo response.');
  }

  // Match demo suggestions or provide a comprehensive customer intelligence synthesis
  const trimmed = message.trim();
  for (const [key, answer] of Object.entries(DEMO_AI_RESPONSES)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase().slice(0, 15))) {
      return answer;
    }
  }

  // Default contextual intelligence assistant response
  return `### CEIP Intelligence Analysis

Regarding your query: "${message}"

Based on the latest cross-channel signals across **24,850 monitored accounts**:

- **Experience Health:** Current CES is 4.3/5.0 with positive sentiment stabilizing at 78.4%.
- **Risk Hotspots:** 3,420 accounts show elevated churn flags, primarily concentrated in accounts with >4 support escalations and contract renewals within 30 days.
- **Strategic Recommendation:** We recommend reviewing the **Retention Intelligence** action queue to prioritize high-ARR enterprise accounts like *Zenith Logistics* and *Hyperion Analytics*.

*Note: This synthesis utilizes CEIP cached intelligence signals. Connect FastAPI backend for live custom queries.*`;
}