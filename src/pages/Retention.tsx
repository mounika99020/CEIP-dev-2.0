import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Users,
  DollarSign,
  Layers,
  ChevronRight,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  DEMO_RETENTION_SUMMARY,
  DEMO_RETENTION_ACTIONS,
  RetentionActionItem,
} from '../data/demoData';
import { formatNumber, formatCurrency } from '../lib/utils';

export const Retention: React.FC = () => {
  const navigate = useNavigate();
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedActionItem, setSelectedActionItem] =
    useState<RetentionActionItem | null>(null);

  const workflowSteps = [
    { title: 'Customer Signals', desc: 'Usage drops, support tickets, survey shifts' },
    { title: 'Risk Analysis', desc: 'ML multi-factor churn probability scoring' },
    { title: 'Customer Segment', desc: 'Enterprise / Mid-Market contract tiering' },
    { title: 'Recommended Action', desc: 'Targeted playbooks & executive outreach' },
    { title: 'Retention Opportunity', desc: 'Preserved ARR & long-term renewal' },
  ];

  const filteredActions =
    priorityFilter === 'All'
      ? DEMO_RETENTION_ACTIONS
      : DEMO_RETENTION_ACTIONS.filter(
          (item) => item.priority === priorityFilter
        );

  return (
    <PageContainer>
      {/* Page Title & Strategic Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#1c2638] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Prescriptive Decision Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Retention Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn customer risk signals into actionable retention opportunities.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/predictions?tab=retention')}
          className="shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Retention Recommendation
        </Button>
      </div>

      {/* Top 3 Summary Counters + ARR Pool */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                At-Risk Customers
              </p>
              <div className="text-3xl font-bold text-rose-400 mt-1 font-mono">
                {formatNumber(DEMO_RETENTION_SUMMARY.atRiskCustomers)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-[#1c2638]">
            Exceeding churn danger threshold
          </p>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Priority Interventions
              </p>
              <div className="text-3xl font-bold text-amber-400 mt-1 font-mono">
                {formatNumber(DEMO_RETENTION_SUMMARY.priorityInterventions)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-[#1c2638]">
            Immediate response queue
          </p>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Retention Opportunities
              </p>
              <div className="text-3xl font-bold text-indigo-400 mt-1 font-mono">
                {formatNumber(DEMO_RETENTION_SUMMARY.retentionOpportunities)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-[#1c2638]">
            Positive intervention candidates
          </p>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Salvageable ARR
              </p>
              <div className="text-3xl font-bold text-emerald-400 mt-1 font-mono">
                {formatCurrency(DEMO_RETENTION_SUMMARY.salvageableRevenue)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-[#1c2638]">
            Estimated annual recovery pool
          </p>
        </Card>
      </div>

      {/* Retention Workflow Diagram */}
      <Card className="border-[#1c2638] bg-gradient-to-r from-[#111726] via-[#131b2e] to-[#111726]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c2638]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              CEIP Retention Decision Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              From raw telemetry signals to closed-loop revenue retention.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
            5-Stage Loop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    STAGE 0{idx + 1}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <ChevronRight className="hidden lg:block w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-200">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Professional Retention Action Table */}
      <Card className="border-[#1c2638]">
        <CardHeader>
          <div>
            <CardTitle>Prescribed Retention Actions</CardTitle>
            <CardDescription>
              Ranked list of accounts flagged for proactive success intervention.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Priority:</span>
            <div className="flex items-center gap-1">
              {['All', 'Critical', 'High', 'Medium'].map((pri) => (
                <button
                  key={pri}
                  onClick={() => setPriorityFilter(pri)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    priorityFilter === pri
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c2638] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer ID & Account</th>
                <th className="py-2.5 px-3">Risk</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3">Key Risk Signal</th>
                <th className="py-2.5 px-3">Recommended Action</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3 text-right">ARR at Risk</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]/60 text-xs">
              {filteredActions.map((action) => (
                <tr
                  key={action.id}
                  className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedActionItem(action)}
                >
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors block">
                      {action.accountName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {action.customerId}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      size="sm"
                      variant={
                        action.riskLevel === 'High'
                          ? 'high'
                          : action.riskLevel === 'Medium'
                          ? 'medium'
                          : 'low'
                      }
                    >
                      {action.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300">{action.segment}</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <span className="text-slate-300 line-clamp-1">
                      {action.keySignal}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-sm">
                    <span className="text-indigo-200 font-medium line-clamp-1">
                      {action.recommendedAction}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      size="sm"
                      variant={
                        action.priority === 'Critical'
                          ? 'high'
                          : action.priority === 'High'
                          ? 'medium'
                          : 'info'
                      }
                    >
                      {action.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-200">
                    {formatCurrency(action.arrAtRisk)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedActionItem(action);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Action Detail Modal */}
      {selectedActionItem && (
        <Modal
          isOpen={!!selectedActionItem}
          onClose={() => setSelectedActionItem(null)}
          title={`Retention Dossier: ${selectedActionItem.accountName}`}
          description={`Customer ID: ${selectedActionItem.customerId} • Tier: ${selectedActionItem.segment}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Churn Risk</span>
                <Badge
                  size="sm"
                  variant={
                    selectedActionItem.riskLevel === 'High'
                      ? 'high'
                      : 'medium'
                  }
                  className="mt-1"
                >
                  {selectedActionItem.riskLevel} Risk
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Urgency</span>
                <Badge
                  size="sm"
                  variant={
                    selectedActionItem.priority === 'Critical'
                      ? 'high'
                      : 'medium'
                  }
                  className="mt-1"
                >
                  {selectedActionItem.priority}
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Annual ARR at Risk</span>
                <span className="text-base font-bold text-rose-400 font-mono mt-0.5 block">
                  {formatCurrency(selectedActionItem.arrAtRisk)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0f17] border border-[#1f2a3f] space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Detected Risk Signals
                </span>
                <p className="text-xs text-slate-200">
                  {selectedActionItem.keySignal}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1f2a3f]">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                  Prescribed Retention Intervention
                </span>
                <p className="text-xs text-white font-medium">
                  {selectedActionItem.recommendedAction}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1f2a3f]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Projected Value Recovery Impact
                </span>
                <p className="text-xs text-emerald-400 font-medium">
                  {selectedActionItem.potentialImpact}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedActionItem(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const item = selectedActionItem;
                  setSelectedActionItem(null);
                  navigate(`/predictions?tab=retention&customerId=${item.customerId}`);
                }}
              >
                Execute in Prediction Center
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};