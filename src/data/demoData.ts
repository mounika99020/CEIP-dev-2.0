// DEMO DATA — WILL BE REPLACED BY FASTAPI

export interface OverviewKPIData {
  totalCustomers: {
    value: number;
    change: number;
    period: string;
  };
  customersAtRisk: {
    value: number;
    change: number;
    period: string;
  };
  positiveSentiment: {
    value: number; // percentage e.g. 78.4
    change: number;
    period: string;
  };
  retentionOpportunities: {
    value: number;
    change: number;
    period: string;
  };
}

export interface ExperienceSignalTrend {
  month: string;
  engagement: number;
  sentiment: number;
  risk: number;
}

export interface RiskDistributionItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface IntelligenceFlowStep {
  id: string;
  stepNumber: string;
  title: string;
  shortDesc: string;
  details: string;
  icon: string;
}

export interface RecentInsight {
  id: string;
  category: 'Churn Risk Increase' | 'Negative Sentiment' | 'Retention Opportunity' | 'Customer Experience Signal';
  customerId: string;
  accountName: string;
  summary: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  metric: string;
}

export interface CustomerExperienceItem {
  id: string;
  accountName: string;
  segment: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Growth';
  contractType: 'Annual' | 'Monthly' | 'Multi-Year';
  engagementScore: number;
  cesScore: number;
  npsScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  riskLevel: 'High' | 'Medium' | 'Low';
  monthlySpend: number;
  lastActiveDays: number;
  supportTickets: number;
}

export interface FeedbackItem {
  id: string;
  customerId: string;
  accountName: string;
  text: string;
  category: 'Product Usability' | 'Billing & Pricing' | 'Support Quality' | 'Performance' | 'Feature Request';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  date: string;
}

export interface ChurnRiskCustomer {
  id: string;
  accountName: string;
  churnProbability: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  segment: string;
  contractType: string;
  monthlySpend: number;
  supportCalls: number;
  keyTrigger: string;
  daysSinceLastActivity: number;
}

export interface RetentionActionItem {
  id: string;
  customerId: string;
  accountName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  segment: string;
  keySignal: string;
  recommendedAction: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  arrAtRisk: number;
  potentialImpact: string;
}

// ==========================================
// CENTRALIZED DEMO DATA OBJECTS
// ==========================================

export const DEMO_OVERVIEW_KPIS: OverviewKPIData = {
  totalCustomers: {
    value: 24850,
    change: 5.4,
    period: 'vs last quarter',
  },
  customersAtRisk: {
    value: 3420,
    change: -2.1,
    period: 'vs last quarter',
  },
  positiveSentiment: {
    value: 78.4,
    change: 3.8,
    period: 'vs last month',
  },
  retentionOpportunities: {
    value: 842,
    change: 12.6,
    period: 'active pipeline',
  },
};

export const DEMO_EXPERIENCE_TRENDS: ExperienceSignalTrend[] = [
  { month: 'Jan', engagement: 74, sentiment: 71, risk: 24 },
  { month: 'Feb', engagement: 76, sentiment: 73, risk: 22 },
  { month: 'Mar', engagement: 73, sentiment: 69, risk: 26 },
  { month: 'Apr', engagement: 78, sentiment: 75, risk: 21 },
  { month: 'May', engagement: 82, sentiment: 77, risk: 19 },
  { month: 'Jun', engagement: 80, sentiment: 74, risk: 23 },
  { month: 'Jul', engagement: 85, sentiment: 80, risk: 18 },
  { month: 'Aug', engagement: 83, sentiment: 78, risk: 17 },
  { month: 'Sep', engagement: 87, sentiment: 82, risk: 16 },
  { month: 'Oct', engagement: 84, sentiment: 79, risk: 19 },
  { month: 'Nov', engagement: 88, sentiment: 81, risk: 15 },
  { month: 'Dec', engagement: 91, sentiment: 84, risk: 14 },
];

export const DEMO_RISK_DISTRIBUTION: RiskDistributionItem[] = [
  { name: 'Low Risk', value: 68, count: 16898, color: '#10b981' },
  { name: 'Medium Risk', value: 18, count: 4532, color: '#f59e0b' },
  { name: 'High Risk', value: 14, count: 3420, color: '#ef4444' },
];

export const DEMO_INTELLIGENCE_FLOW: IntelligenceFlowStep[] = [
  {
    id: 'signals',
    stepNumber: '01',
    title: 'Customer Segmentation',
    shortDesc: 'Continuous behavioral & telemetry ingestion',
    details: 'Monitors session frequency, contract lifecycle, support ticket patterns, and product feature adoption drops.',
    icon: 'Radio',
  },
  {
    id: 'sentiment',
    stepNumber: '02',
    title: 'Sentiment Analysis',
    shortDesc: 'NLP feedback & perception classification',
    details: 'Evaluates customer verbatim feedback, CSAT/NPS survey responses, and sentiment shift vectors in real time.',
    icon: 'HeartHandshake',
  },
  {
    id: 'churn',
    stepNumber: '03',
    title: 'Churn Prediction',
    shortDesc: 'Multi-factor churn probability scoring',
    details: 'Applies saved machine learning models to synthesize behavioral and sentiment features into an actionable churn risk score.',
    icon: 'ShieldAlert',
  },
  {
    id: 'retention',
    stepNumber: '04',
    title: 'Retention Intelligence',
    shortDesc: 'Prescriptive action & value recovery',
    details: 'Delivers personalized intervention strategies, account rescue workflows, and executive check-in recommendations.',
    icon: 'Sparkles',
  },
];

export const DEMO_RECENT_INSIGHTS: RecentInsight[] = [
  {
    id: 'INS-01',
    category: 'Churn Risk Increase',
    customerId: 'CUST-8910',
    accountName: 'Meridian Global Systems',
    summary: 'Churn probability rose to 84% following 3 escalated support tickets in 7 days.',
    severity: 'high',
    timestamp: '14 mins ago',
    metric: 'Risk +32%',
  },
  {
    id: 'INS-02',
    category: 'Negative Sentiment',
    customerId: 'CUST-4122',
    accountName: 'Apex Cloud Dynamics',
    summary: 'Detected negative sentiment in executive QBR survey regarding onboarding friction.',
    severity: 'high',
    timestamp: '1 hour ago',
    metric: 'Sentiment -24%',
  },
  {
    id: 'INS-03',
    category: 'Retention Opportunity',
    customerId: 'CUST-3048',
    accountName: 'Vanguard Logistics',
    summary: 'High-value annual renewal within 30 days. Feature utilization exceeds 92%.',
    severity: 'low',
    timestamp: '2 hours ago',
    metric: '$84,000 ARR',
  },
  {
    id: 'INS-04',
    category: 'Customer Experience Signal',
    customerId: 'CUST-5519',
    accountName: 'Stratosphere Media Corp',
    summary: 'App usage duration increased 45% week-over-week across 120 team seats.',
    severity: 'low',
    timestamp: '4 hours ago',
    metric: '+45% Usage',
  },
  {
    id: 'INS-05',
    category: 'Churn Risk Increase',
    customerId: 'CUST-7241',
    accountName: 'Horizon Financial Ltd',
    summary: 'Monthly active logins dropped 60% after contract billing cycle transition.',
    severity: 'medium',
    timestamp: '6 hours ago',
    metric: 'Risk +18%',
  },
];

export const DEMO_RETENTION_SUMMARY = {
  atRiskCustomers: 3420,
  priorityInterventions: 418,
  retentionOpportunities: 842,
  salvageableRevenue: 1480000,
  totalArrAtRisk: 2850000,
};

// ==========================================
// CUSTOMER EXPERIENCE PAGE DATA
// ==========================================

export const DEMO_CX_METRICS = {
  customerEffortScore: { value: 4.3, max: 5.0, status: 'Optimal', change: '+0.2' },
  netPromoterScore: { value: 52, max: 100, status: 'Strong', change: '+5 pts' },
  satisfactionRate: { value: 86.4, max: 100, status: 'Healthy', change: '+2.8%' },
  averageActiveTime: { value: 48.5, unit: 'hrs/mo', status: 'Growing', change: '+14%' },
};

export const DEMO_CX_CUSTOMERS: CustomerExperienceItem[] = [
  {
    id: 'CUST-1001',
    accountName: 'Nexus Enterprise Technologies',
    segment: 'Enterprise',
    contractType: 'Multi-Year',
    engagementScore: 94,
    cesScore: 4.8,
    npsScore: 68,
    sentiment: 'Positive',
    riskLevel: 'Low',
    monthlySpend: 14500,
    lastActiveDays: 1,
    supportTickets: 1,
  },
  {
    id: 'CUST-1002',
    accountName: 'Hyperion Analytics Group',
    segment: 'Enterprise',
    contractType: 'Annual',
    engagementScore: 48,
    cesScore: 2.9,
    npsScore: -12,
    sentiment: 'Negative',
    riskLevel: 'High',
    monthlySpend: 9800,
    lastActiveDays: 18,
    supportTickets: 6,
  },
  {
    id: 'CUST-1003',
    accountName: 'Solaris Cloud Infrastructure',
    segment: 'Mid-Market',
    contractType: 'Annual',
    engagementScore: 78,
    cesScore: 4.2,
    npsScore: 45,
    sentiment: 'Positive',
    riskLevel: 'Low',
    monthlySpend: 4200,
    lastActiveDays: 2,
    supportTickets: 2,
  },
  {
    id: 'CUST-1004',
    accountName: 'Cobalt Media Partners',
    segment: 'Growth',
    contractType: 'Monthly',
    engagementScore: 56,
    cesScore: 3.4,
    npsScore: 10,
    sentiment: 'Neutral',
    riskLevel: 'Medium',
    monthlySpend: 1850,
    lastActiveDays: 7,
    supportTickets: 4,
  },
  {
    id: 'CUST-1005',
    accountName: 'Zenith Logistics Systems',
    segment: 'Enterprise',
    contractType: 'Multi-Year',
    engagementScore: 38,
    cesScore: 2.4,
    npsScore: -35,
    sentiment: 'Negative',
    riskLevel: 'High',
    monthlySpend: 18200,
    lastActiveDays: 24,
    supportTickets: 9,
  },
  {
    id: 'CUST-1006',
    accountName: 'Beacon BioHealth Labs',
    segment: 'Mid-Market',
    contractType: 'Annual',
    engagementScore: 82,
    cesScore: 4.5,
    npsScore: 55,
    sentiment: 'Positive',
    riskLevel: 'Low',
    monthlySpend: 5400,
    lastActiveDays: 3,
    supportTickets: 1,
  },
  {
    id: 'CUST-1007',
    accountName: 'OmniTrade Global Services',
    segment: 'SMB',
    contractType: 'Monthly',
    engagementScore: 42,
    cesScore: 3.1,
    npsScore: -5,
    sentiment: 'Neutral',
    riskLevel: 'High',
    monthlySpend: 890,
    lastActiveDays: 14,
    supportTickets: 5,
  },
  {
    id: 'CUST-1008',
    accountName: 'Kestrel Data Solutions',
    segment: 'Growth',
    contractType: 'Annual',
    engagementScore: 71,
    cesScore: 4.0,
    npsScore: 38,
    sentiment: 'Positive',
    riskLevel: 'Medium',
    monthlySpend: 2300,
    lastActiveDays: 4,
    supportTickets: 3,
  },
];

export const DEMO_SEGMENT_DISTRIBUTION = [
  { name: 'Enterprise', count: 420, avgCES: 4.4, avgRisk: 12, arrShare: 46 },
  { name: 'Mid-Market', count: 2150, avgCES: 4.2, avgRisk: 16, arrShare: 29 },
  { name: 'Growth', count: 6480, avgCES: 4.1, avgRisk: 19, arrShare: 16 },
  { name: 'SMB', count: 15800, avgCES: 3.9, avgRisk: 24, arrShare: 9 },
];

// ==========================================
// SENTIMENT PAGE DATA
// ==========================================

export const DEMO_SENTIMENT_SUMMARY = {
  positive: { percentage: 68.2, count: 16948, trend: '+4.1%' },
  neutral: { percentage: 19.5, count: 4846, trend: '-1.8%' },
  negative: { percentage: 12.3, count: 3056, trend: '-2.3%' },
};

export const DEMO_SENTIMENT_TRENDS = [
  { period: 'Week 1', positive: 64, neutral: 22, negative: 14 },
  { period: 'Week 2', positive: 65, neutral: 21, negative: 14 },
  { period: 'Week 3', positive: 67, neutral: 20, negative: 13 },
  { period: 'Week 4', positive: 69, neutral: 19, negative: 12 },
  { period: 'Week 5', positive: 68, neutral: 20, negative: 12 },
  { period: 'Week 6', positive: 71, neutral: 18, negative: 11 },
];

export const DEMO_SENTIMENT_CATEGORIES = [
  { category: 'Product Usability', positive: 74, neutral: 18, negative: 8 },
  { category: 'Performance & Speed', positive: 81, neutral: 13, negative: 6 },
  { category: 'Support Quality', positive: 62, neutral: 22, negative: 16 },
  { category: 'Billing & Pricing', positive: 45, neutral: 28, negative: 27 },
  { category: 'Integration & API', positive: 69, neutral: 21, negative: 10 },
];

export const DEMO_RECENT_FEEDBACK: FeedbackItem[] = [
  {
    id: 'FB-901',
    customerId: 'CUST-1002',
    accountName: 'Hyperion Analytics Group',
    text: 'Integration setup failed twice and our team experienced sync latency during peak operational hours. Escalation response was slow.',
    category: 'Performance',
    sentiment: 'Negative',
    confidence: 0.94,
    date: 'Today, 11:24 AM',
  },
  {
    id: 'FB-902',
    customerId: 'CUST-1001',
    accountName: 'Nexus Enterprise Technologies',
    text: 'The automated intelligence reporting saved our customer ops team 15 hours weekly. Smooth deployment and exceptional responsiveness.',
    category: 'Product Usability',
    sentiment: 'Positive',
    confidence: 0.98,
    date: 'Today, 09:40 AM',
  },
  {
    id: 'FB-903',
    customerId: 'CUST-1005',
    accountName: 'Zenith Logistics Systems',
    text: 'Billing statement contained line items from unprovisioned sandbox seats. Still awaiting clarification from accounts team.',
    category: 'Billing & Pricing',
    sentiment: 'Negative',
    confidence: 0.89,
    date: 'Yesterday, 04:15 PM',
  },
  {
    id: 'FB-904',
    customerId: 'CUST-1004',
    accountName: 'Cobalt Media Partners',
    text: 'Feature set meets our requirements, though we would appreciate more custom dashboard export formats in upcoming releases.',
    category: 'Feature Request',
    sentiment: 'Neutral',
    confidence: 0.82,
    date: 'Yesterday, 02:00 PM',
  },
  {
    id: 'FB-905',
    customerId: 'CUST-1006',
    accountName: 'Beacon BioHealth Labs',
    text: 'Very satisfied with the real-time sentiment alerts. Helps us catch customer friction before quarterly business reviews.',
    category: 'Product Usability',
    sentiment: 'Positive',
    confidence: 0.96,
    date: 'Oct 06, 2026',
  },
];

// ==========================================
// CHURN PAGE DATA
// ==========================================

export const DEMO_CHURN_SUMMARY = {
  highRisk: { count: 3420, percent: 13.8, arrAtRisk: 2850000 },
  mediumRisk: { count: 4532, percent: 18.2, arrAtRisk: 1640000 },
  lowRisk: { count: 16898, percent: 68.0, arrAtRisk: 0 },
  projectedChurnRate: 4.8,
  retentionSuccessTarget: 78.5,
};

export const DEMO_CHURN_FACTORS = [
  { factor: 'Customer Support Escalations (>4 calls)', importance: 88, correlation: 'High' },
  { factor: 'Drop in Monthly Active Logins (>50%)', importance: 82, correlation: 'High' },
  { factor: 'Last Purchase / Activity > 30 Days Ago', importance: 74, correlation: 'Moderate' },
  { factor: 'Contract Nearing Expiry (<45 Days)', importance: 68, correlation: 'Moderate' },
  { factor: 'High Discount Dependency (>35%)', importance: 54, correlation: 'Moderate' },
  { factor: 'Low Feature Adoption Depth', importance: 48, correlation: 'Low' },
];

export const DEMO_CHURN_CUSTOMERS: ChurnRiskCustomer[] = [
  {
    id: 'CUST-1005',
    accountName: 'Zenith Logistics Systems',
    churnProbability: 89,
    riskLevel: 'High',
    segment: 'Enterprise',
    contractType: 'Multi-Year',
    monthlySpend: 18200,
    supportCalls: 9,
    keyTrigger: 'Repeated unresolved billing disputes & zero logins in 24d',
    daysSinceLastActivity: 24,
  },
  {
    id: 'CUST-1002',
    accountName: 'Hyperion Analytics Group',
    churnProbability: 84,
    riskLevel: 'High',
    segment: 'Enterprise',
    contractType: 'Annual',
    monthlySpend: 9800,
    supportCalls: 6,
    keyTrigger: 'Integration failure & negative CSAT survey response',
    daysSinceLastActivity: 18,
  },
  {
    id: 'CUST-1007',
    accountName: 'OmniTrade Global Services',
    churnProbability: 76,
    riskLevel: 'High',
    segment: 'SMB',
    contractType: 'Monthly',
    monthlySpend: 890,
    supportCalls: 5,
    keyTrigger: 'Monthly contract nearing renewal with 14d inactivity',
    daysSinceLastActivity: 14,
  },
  {
    id: 'CUST-1004',
    accountName: 'Cobalt Media Partners',
    churnProbability: 58,
    riskLevel: 'Medium',
    segment: 'Growth',
    contractType: 'Monthly',
    monthlySpend: 1850,
    supportCalls: 4,
    keyTrigger: 'Usage drop-off following subscription tier downgrade',
    daysSinceLastActivity: 7,
  },
  {
    id: 'CUST-1008',
    accountName: 'Kestrel Data Solutions',
    churnProbability: 46,
    riskLevel: 'Medium',
    segment: 'Growth',
    contractType: 'Annual',
    monthlySpend: 2300,
    supportCalls: 3,
    keyTrigger: 'Discount usage expired; 3 recent feature requests unfulfilled',
    daysSinceLastActivity: 4,
  },
];

// ==========================================
// RETENTION PAGE DATA
// ==========================================

export const DEMO_RETENTION_ACTIONS: RetentionActionItem[] = [
  {
    id: 'RET-01',
    customerId: 'CUST-1005',
    accountName: 'Zenith Logistics Systems',
    riskLevel: 'High',
    segment: 'Enterprise',
    keySignal: '9 support calls, billing discrepancy, 24d inactivity',
    recommendedAction: 'Executive sponsor outreach & proactive billing credit review',
    priority: 'Critical',
    arrAtRisk: 218400,
    potentialImpact: 'High - $218k ARR retention opportunity',
  },
  {
    id: 'RET-02',
    customerId: 'CUST-1002',
    accountName: 'Hyperion Analytics Group',
    riskLevel: 'High',
    segment: 'Enterprise',
    keySignal: 'Integration sync latency & negative sentiment score',
    recommendedAction: 'Assign dedicated Solutions Engineer for API architecture review',
    priority: 'Critical',
    arrAtRisk: 117600,
    potentialImpact: 'High - Account critical for Q4 renewal',
  },
  {
    id: 'RET-03',
    customerId: 'CUST-1007',
    accountName: 'OmniTrade Global Services',
    riskLevel: 'High',
    segment: 'SMB',
    keySignal: 'Monthly contract, 14 days without active session',
    recommendedAction: 'Trigger automated onboarding re-activation sequence & training guide',
    priority: 'High',
    arrAtRisk: 10680,
    potentialImpact: 'Moderate - Automated re-engagement candidate',
  },
  {
    id: 'RET-04',
    customerId: 'CUST-1004',
    accountName: 'Cobalt Media Partners',
    riskLevel: 'Medium',
    segment: 'Growth',
    keySignal: 'Usage plateaued, recent inquiry on custom reporting formats',
    recommendedAction: 'Offer beta access to advanced reporting module + 1:1 strategy session',
    priority: 'Medium',
    arrAtRisk: 22200,
    potentialImpact: 'Opportunity - Upsell to Annual tier with custom reports',
  },
  {
    id: 'RET-05',
    customerId: 'CUST-1008',
    accountName: 'Kestrel Data Solutions',
    riskLevel: 'Medium',
    segment: 'Growth',
    keySignal: 'Promotional discount expired; login frequency declined 25%',
    recommendedAction: 'Provide structured annual incentive package with roadmap preview',
    priority: 'Medium',
    arrAtRisk: 27600,
    potentialImpact: 'Moderate - Prevent contract lapse',
  },
];

// ==========================================
// PREDICTIONS PRESET DEMO EXAMPLES
// ==========================================

export const DEMO_PREDICTION_PRESETS = {
  churnHighRisk: {
    customerId: 'CUST-9821',
    age: 44,
    subscriptionDuration: 6,
    contractType: 'Monthly',
    monthlyLogins: 4,
    lastPurchaseDaysAgo: 38,
    appUsageTime: 12.5,
    monthlySpend: 240,
    discountUsagePercentage: 45,
    customerSupportCalls: 7,
  },
  churnLowRisk: {
    customerId: 'CUST-3104',
    age: 38,
    subscriptionDuration: 28,
    contractType: 'Annual',
    monthlyLogins: 42,
    lastPurchaseDaysAgo: 4,
    appUsageTime: 68.0,
    monthlySpend: 1250,
    discountUsagePercentage: 5,
    customerSupportCalls: 1,
  },
  sentimentNegativeSample: 'We have encountered repeated dashboard timeouts during end-of-month reporting. Our team is frustrated and considering alternative vendors if stability does not improve immediately.',
  sentimentPositiveSample: 'The predictive churn alerts allowed us to salvage two key accounts before renewal. CEIP customer intelligence has already paid for itself.',
};

// ==========================================
// AI ASSISTANT DEMO SUGGESTIONS & RESPONSES
// ==========================================

export const DEMO_AI_SUGGESTIONS = [
  'Which customers are at high churn risk?',
  'What are the main sentiment trends?',
  'Which customers need retention intervention?',
  'What factors are associated with churn?',
  'Summarize current customer experience.',
];

export const DEMO_AI_RESPONSES: Record<string, string> = {
  'Which customers are at high churn risk?': 
    `Based on current model scoring across the portfolio, **3,420 customers (13.8%)** exhibit elevated churn risk.

### Top High-Risk Enterprise Accounts:
1. **Zenith Logistics Systems (CUST-1005)** — 89% Churn Probability
   - *Key Driver:* 9 unresolved customer support tickets, billing dispute, 24 days without active login.
   - *ARR Impact:* $218,400.
2. **Hyperion Analytics Group (CUST-1002)** — 84% Churn Probability
   - *Key Driver:* Integration latency issues, negative sentiment score on executive QBR.
   - *ARR Impact:* $117,600.
3. **OmniTrade Global Services (CUST-1007)** — 76% Churn Probability
   - *Key Driver:* Month-to-month contract renewal due in 7 days, 14 days inactivity.

*Recommendation:* Initiate Executive Intervention workflow for Zenith Logistics and assign Solutions Engineer for Hyperion.`,

  'What are the main sentiment trends?':
    `Customer sentiment analysis over the past 30 days indicates an overall positive trajectory with notable segment variances:

- **Overall Positive:** 78.4% (+3.8% MoM)
- **Neutral:** 12.1%
- **Negative:** 9.5%

### Key Sentiment Categories:
- **Product Usability & Features:** 74% Positive — highly favorable feedback regarding automation and reporting speed.
- **Support Responsiveness:** 62% Positive — improved from previous month following ticket triage updates.
- **Billing & Contract Transparency:** 45% Positive — remains the primary negative driver, accounting for 58% of all negative sentiment tags.

*Next Step:* Review billing UX and invoice clarity for accounts in the Growth and Mid-Market segments.`,

  'Which customers need retention intervention?':
    `There are currently **418 accounts flagged for Priority Intervention**, representing $1.48M in salvageable Annual Recurring Revenue (ARR).

### Priority Queue:
1. **CUST-1005 (Zenith Logistics Systems)** — Priority: **Critical**
   - Action: Executive sponsor check-in and billing ledger reconciliation.
2. **CUST-1002 (Hyperion Analytics Group)** — Priority: **Critical**
   - Action: Dedicate senior Solutions Engineer to resolve webhook & API sync latency.
3. **CUST-1007 (OmniTrade Global Services)** — Priority: **High**
   - Action: Trigger targeted re-activation email sequence + offer 1:1 workflow consultation.
4. **CUST-1004 (Cobalt Media Partners)** — Priority: **Medium**
   - Action: Offer early beta preview for custom export formatting to secure Annual lock-in.`,

  'What factors are associated with churn?':
    `Analysis of historical model weights and behavioral signals reveals the following primary factors driving customer churn:

1. **Customer Support Escalations (>4 tickets within 30 days)** — Relative Importance: **88%**
2. **Drop in Monthly Active Logins (>50% MoM)** — Relative Importance: **82%**
3. **Inactivity Duration (>21 days since last session)** — Relative Importance: **74%**
4. **Contract Renewal Proximity (<45 days on monthly or 1-year tier)** — Relative Importance: **68%**
5. **High Promotional Discount Dependency (>35%)** — Relative Importance: **54%**

Accounts with *both* >4 support tickets and >50% login drop show an 87.2% probability of churn within 60 days if untreated.`,

  'Summarize current customer experience.':
    `### CEIP Executive Customer Experience Summary

- **Customer Effort Score (CES):** 4.3 / 5.0 (Optimal; +0.2 vs last quarter)
- **Net Promoter Score (NPS):** +52 (Strong tier; +5 points improvement)
- **Overall Satisfaction (CSAT):** 86.4% across all active accounts
- **Portfolio Engagement:** 91 / 100 average engagement index in December

**Summary Assessment:**
Customer experience health is strong across Enterprise and Mid-Market tiers, but friction exists around billing dispute handling and monthly contract transitions in SMB/Growth segments. Proactive engagement in Q4 has reduced churn by 2.1% across monitored accounts.`,
};