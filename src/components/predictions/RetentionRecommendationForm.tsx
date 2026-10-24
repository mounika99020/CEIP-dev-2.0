import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  generateRetentionRecommendation,
  RetentionRecommendationRequest,
  RetentionRecommendationResponse,
} from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export const RetentionRecommendationForm: React.FC = () => {
  const [formData, setFormData] = useState<RetentionRecommendationRequest>({
    customerId: 'CUST-1005',
    customerRisk: 'High',
    engagementInformation: 'Drop in active logins over 24 days, 9 unresolved tickets',
    contractInformation: 'Multi-Year Enterprise agreement expiring in 60 days',
    monthlySpend: 18200,
    customerSupportCalls: 9,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<RetentionRecommendationResponse | null>(null);

  const handleInputChange = (
    field: keyof RetentionRecommendationRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateRetentionRecommendation(formData);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-7">
        <Card className="border-[#1c2638]">
          <CardHeader>
            <div>
              <CardTitle>Retention Strategy Generator</CardTitle>
              <CardDescription>
                Synthesize risk signals into prescriptive account preservation workflows.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Prescriptive Intelligence
              </span>
            </div>
          </CardHeader>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer ID"
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                placeholder="e.g. CUST-1005"
                required
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Customer Risk Level
                </label>
                <select
                  value={formData.customerRisk}
                  onChange={(e) => handleInputChange('customerRisk', e.target.value)}
                  className="w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

              <Input
                label="Monthly Spend ($ USD)"
                type="number"
                value={formData.monthlySpend}
                onChange={(e) =>
                  handleInputChange('monthlySpend', Number(e.target.value))
                }
                min={0}
                required
              />

              <Input
                label="Customer Support Calls"
                type="number"
                value={formData.customerSupportCalls}
                onChange={(e) =>
                  handleInputChange('customerSupportCalls', Number(e.target.value))
                }
                min={0}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Engagement Information
              </label>
              <input
                type="text"
                value={formData.engagementInformation}
                onChange={(e) =>
                  handleInputChange('engagementInformation', e.target.value)
                }
                placeholder="e.g. Low login frequency, 6 unclosed tickets"
                className="w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contract Information
              </label>
              <input
                type="text"
                value={formData.contractInformation}
                onChange={(e) =>
                  handleInputChange('contractInformation', e.target.value)
                }
                placeholder="e.g. Multi-Year Enterprise agreement expiring in 60 days"
                className="w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1c2638]">
              <span className="text-[11px] text-slate-500 font-mono">
                Ready for POST /api/retention/recommend
              </span>
              <Button type="submit" isLoading={loading} variant="primary">
                <Target className="w-4 h-4 mr-2" />
                Generate Retention Recommendation
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Result Display Column */}
      <div className="lg:col-span-5">
        <Card className="h-full border-[#1c2638] bg-[#111726]/90 flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Recommendation Summary</CardTitle>
                <CardDescription>
                  Actionable playbook generated for customer retention.
                </CardDescription>
              </div>
              {result && (
                <Badge
                  variant={
                    result.priority === 'Critical'
                      ? 'high'
                      : result.priority === 'High'
                      ? 'medium'
                      : 'info'
                  }
                >
                  {result.priority} Priority
                </Badge>
              )}
            </CardHeader>

            {!result ? (
              <div className="py-14 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Awaiting Recommendation
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Provide account engagement and contract details to receive a tailored retention playbook.
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0b0f17]/90 border border-[#1f2a3f]">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Customer Segment
                    </span>
                    <span className="text-base font-bold text-white">
                      {result.customerSegment}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Protected ARR
                    </span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {formatCurrency(result.estimatedArrProtected)}
                    </span>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    {result.recommendedAction}
                  </p>
                </div>

                {/* Retention Opportunity */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-[#1c2638]">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Retention Opportunity
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.retentionOpportunity}
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-[#1f2a3f] text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Target Timeline:
                  </span>
                  <span className="font-medium text-slate-200">
                    {result.suggestedTimeline}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1c2638] mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>FastAPI retention decision engine</span>
            </span>
            <span className="font-mono">POST /api/retention/recommend</span>
          </div>
        </Card>
      </div>
    </div>
  );
};