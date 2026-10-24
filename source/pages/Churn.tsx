import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Cpu,
  Flame,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  DEMO_CHURN_SUMMARY,
  DEMO_CHURN_FACTORS,
  DEMO_CHURN_CUSTOMERS,
} from '../data/demoData';
import { formatNumber, formatCurrency } from '../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const Churn: React.FC = () => {
  const navigate = useNavigate();

  const churnTrendData = [
    { month: 'Jul', actualChurn: 5.2, predictedChurn: 5.0 },
    { month: 'Aug', actualChurn: 4.9, predictedChurn: 4.8 },
    { month: 'Sep', actualChurn: 5.1, predictedChurn: 5.1 },
    { month: 'Oct', actualChurn: 4.6, predictedChurn: 4.7 },
    { month: 'Nov', actualChurn: 4.4, predictedChurn: 4.3 },
    { month: 'Dec', actualChurn: 4.2, predictedChurn: 4.1 },
  ];

  return (
    <PageContainer>
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#1c2638] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Churn Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify customers with elevated churn risk and prioritize preventative interventions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/predictions?tab=churn')}
          className="shrink-0"
        >
          <Cpu className="w-4 h-4 mr-2" />
          Open Churn Prediction
        </Button>
      </div>

      {/* Top KPI Cards: High Risk, Medium Risk, Low Risk */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* High Risk */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                High Churn Risk
              </p>
              <div className="text-3xl font-bold text-rose-400 mt-1 font-mono">
                {formatNumber(DEMO_CHURN_SUMMARY.highRisk.count)}
                <span className="text-xs text-rose-400/80 font-normal ml-2">
                  ({DEMO_CHURN_SUMMARY.highRisk.percent}%)
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#1c2638]">
            <span className="text-slate-400">ARR Exposure:</span>
            <span className="text-rose-400 font-bold font-mono">
              {formatCurrency(DEMO_CHURN_SUMMARY.highRisk.arrAtRisk)}
            </span>
          </div>
        </Card>

        {/* Medium Risk */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Medium Churn Risk
              </p>
              <div className="text-3xl font-bold text-amber-400 mt-1 font-mono">
                {formatNumber(DEMO_CHURN_SUMMARY.mediumRisk.count)}
                <span className="text-xs text-amber-400/80 font-normal ml-2">
                  ({DEMO_CHURN_SUMMARY.mediumRisk.percent}%)
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#1c2638]">
            <span className="text-slate-400">ARR Exposure:</span>
            <span className="text-amber-400 font-bold font-mono">
              {formatCurrency(DEMO_CHURN_SUMMARY.mediumRisk.arrAtRisk)}
            </span>
          </div>
        </Card>

        {/* Low Risk */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Low Churn Risk
              </p>
              <div className="text-3xl font-bold text-emerald-400 mt-1 font-mono">
                {formatNumber(DEMO_CHURN_SUMMARY.lowRisk.count)}
                <span className="text-xs text-emerald-400/80 font-normal ml-2">
                  ({DEMO_CHURN_SUMMARY.lowRisk.percent}%)
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#1c2638]">
            <span className="text-slate-400">Account Stability:</span>
            <span className="text-emerald-400 font-bold font-mono">
              Healthy & Retained
            </span>
          </div>
        </Card>
      </div>

      {/* Churn Trend & Top Predictive Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Churn Trend Line */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col border-[#1c2638]">
            <CardHeader>
              <div>
                <CardTitle>Churn Rate Trajectory</CardTitle>
                <CardDescription>
                  Actual churn percentage vs machine learning predicted trajectory.
                </CardDescription>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Monthly Cohort Rate (%)
              </span>
            </CardHeader>

            <div className="flex-1 w-full min-h-[260px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={churnTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[3, 6]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111726',
                      borderColor: '#24314c',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f1f5f9',
                    }}
                    formatter={(val: any) => [`${val}%`, '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="actualChurn"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    name="Actual Churn"
                    dot={{ r: 4, fill: '#ef4444' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedChurn"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    name="Model Forecast"
                    dot={{ r: 4, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Churn Driver Feature Importance */}
        <div className="lg:col-span-5">
          <Card className="h-full border-[#1c2638] flex flex-col justify-between">
            <div>
              <CardHeader>
                <div>
                  <CardTitle>Primary Churn Predictive Factors</CardTitle>
                  <CardDescription>
                    Feature importance weights determined by model inference.
                  </CardDescription>
                </div>
              </CardHeader>

              <div className="space-y-3 mt-2">
                {DEMO_CHURN_FACTORS.map((factor, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 truncate pr-2">
                        {factor.factor}
                      </span>
                      <span className="font-mono text-slate-400 shrink-0 font-medium">
                        {factor.importance}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500"
                        style={{ width: `${factor.importance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c2638] mt-3 text-[11px] text-slate-500">
              Correlated with multi-signal customer behavior patterns.
            </div>
          </Card>
        </div>
      </div>

      {/* Business Impact Section */}
      <Card className="border-[#1c2638] bg-gradient-to-r from-[#111726] via-[#141d2f] to-[#111726]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">
              Business Revenue Impact
            </span>
            <h3 className="text-lg font-bold text-white">
              ARR At-Risk Summary
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Synthesizing churn risk models with customer account value highlights immediate revenue exposure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-[#1f2a3f]">
            <span className="text-xs text-slate-400 block">Total ARR Under Risk</span>
            <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
              {formatCurrency(DEMO_CHURN_SUMMARY.highRisk.arrAtRisk + DEMO_CHURN_SUMMARY.mediumRisk.arrAtRisk)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Across {formatNumber(DEMO_CHURN_SUMMARY.highRisk.count + DEMO_CHURN_SUMMARY.mediumRisk.count)} monitored accounts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
            <span className="text-xs text-indigo-300 block">Target Salvageable ARR</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
              {formatCurrency(1850000)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Via Retention Intelligence action workflows
            </span>
          </div>
        </div>
      </Card>

      {/* High-Risk Customer Table */}
      <Card className="border-[#1c2638]">
        <CardHeader>
          <div>
            <CardTitle>Elevated Churn Risk Accounts</CardTitle>
            <CardDescription>
              Accounts exceeding the 70% churn risk threshold requiring intervention.
            </CardDescription>
          </div>
          <span className="text-xs text-slate-400">
            Ordered by Churn Probability
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c2638] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer ID & Account</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Churn Probability</th>
                <th className="py-2.5 px-3">Key Risk Trigger</th>
                <th className="py-2.5 px-3 text-right">Support Calls</th>
                <th className="py-2.5 px-3 text-right">Monthly Spend</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]/60 text-xs">
              {DEMO_CHURN_CUSTOMERS.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200 block">
                      {cust.accountName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {cust.id} • {cust.segment}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      size="sm"
                      variant={
                        cust.riskLevel === 'High'
                          ? 'high'
                          : cust.riskLevel === 'Medium'
                          ? 'medium'
                          : 'low'
                      }
                    >
                      {cust.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                    {cust.churnProbability}%
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <span className="text-slate-300 block truncate">
                      {cust.keyTrigger}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {cust.supportCalls}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-200">
                    {formatCurrency(cust.monthlySpend)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/predictions?customerId=${cust.id}`)
                      }
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};