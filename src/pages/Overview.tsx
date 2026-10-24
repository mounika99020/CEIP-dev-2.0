import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  HeartHandshake,
  Target,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { KPICard } from '../components/dashboard/KPICard';
import { ExperienceTrend } from '../components/dashboard/ExperienceTrend';
import { RiskDistribution } from '../components/dashboard/RiskDistribution';
import { IntelligenceFlow } from '../components/dashboard/IntelligenceFlow';
import { RecentInsights } from '../components/dashboard/RecentInsights';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  DEMO_OVERVIEW_KPIS,
  DEMO_EXPERIENCE_TRENDS,
  DEMO_RISK_DISTRIBUTION,
  DEMO_RETENTION_SUMMARY,
} from '../data/demoData';
import { formatNumber, formatCurrency } from '../lib/utils';

export const Overview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Customers"
          value={formatNumber(DEMO_OVERVIEW_KPIS.totalCustomers.value)}
          change={DEMO_OVERVIEW_KPIS.totalCustomers.change}
          period={DEMO_OVERVIEW_KPIS.totalCustomers.period}
          icon={Users}
          accent="indigo"
          helperText="Active subscribed accounts"
        />
        <KPICard
          title="Customers at Risk"
          value={formatNumber(DEMO_OVERVIEW_KPIS.customersAtRisk.value)}
          change={DEMO_OVERVIEW_KPIS.customersAtRisk.change}
          period={DEMO_OVERVIEW_KPIS.customersAtRisk.period}
          icon={ShieldAlert}
          accent="rose"
          helperText="Elevated churn threshold"
        />
        <KPICard
          title="Positive Sentiment"
          value={`${DEMO_OVERVIEW_KPIS.positiveSentiment.value}%`}
          change={DEMO_OVERVIEW_KPIS.positiveSentiment.change}
          period={DEMO_OVERVIEW_KPIS.positiveSentiment.period}
          icon={HeartHandshake}
          accent="teal"
          helperText="30-day NLP sentiment index"
        />
        <KPICard
          title="Retention Opportunities"
          value={formatNumber(DEMO_OVERVIEW_KPIS.retentionOpportunities.value)}
          change={DEMO_OVERVIEW_KPIS.retentionOpportunities.change}
          period={DEMO_OVERVIEW_KPIS.retentionOpportunities.period}
          icon={Target}
          accent="amber"
          helperText="High-value salvageable ARR"
        />
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ExperienceTrend data={DEMO_EXPERIENCE_TRENDS} />
        </div>
        <div className="lg:col-span-4">
          <RiskDistribution data={DEMO_RISK_DISTRIBUTION} />
        </div>
      </div>

      {/* CEIP Core Intelligence Flow Section */}
      <IntelligenceFlow />

      {/* Retention Intelligence Callout & Recent Intelligence Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Intelligence Feature Highlight */}
        <div className="lg:col-span-5">
          <Card className="h-full border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422] flex flex-col justify-between">
            <div>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      Decision Engine
                    </span>
                  </div>
                  <CardTitle>Retention Intelligence</CardTitle>
                  <CardDescription>
                    Turn detected customer risk signals into proactive retention playbooks.
                  </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
              </CardHeader>

              <div className="space-y-3 my-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      At-Risk Customers
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100 font-mono">
                    {formatNumber(DEMO_RETENTION_SUMMARY.atRiskCustomers)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      Priority Interventions
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-amber-300 font-mono">
                    {formatNumber(DEMO_RETENTION_SUMMARY.priorityInterventions)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-xs text-slate-300 font-medium">
                      Retention Opportunities
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-300 font-mono">
                    {formatNumber(DEMO_RETENTION_SUMMARY.retentionOpportunities)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Salvageable ARR Pool:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {formatCurrency(DEMO_RETENTION_SUMMARY.salvageableRevenue)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Prescriptive workflows actively ready for customer success assignment.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1c2638]">
              <Button
                variant="primary"
                className="w-full justify-between"
                onClick={() => navigate('/retention')}
              >
                <span>View Retention Intelligence</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Intelligence Stream */}
        <div className="lg:col-span-7">
          <RecentInsights />
        </div>
      </div>
    </PageContainer>
  );
};