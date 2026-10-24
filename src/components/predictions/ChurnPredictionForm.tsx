import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  predictChurn,
  ChurnPredictionRequest,
  ChurnPredictionResponse,
} from '../../lib/api';
import { DEMO_PREDICTION_PRESETS } from '../../data/demoData';

export const ChurnPredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<ChurnPredictionRequest>({
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
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChurnPredictionResponse | null>(null);

  const handleInputChange = (field: keyof ChurnPredictionRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await predictChurn(formData);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (type: 'high' | 'low') => {
    if (type === 'high') {
      setFormData(DEMO_PREDICTION_PRESETS.churnHighRisk);
    } else {
      setFormData(DEMO_PREDICTION_PRESETS.churnLowRisk);
    }
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-7">
        <Card className="border-[#1c2638]">
          <CardHeader>
            <div>
              <CardTitle>Churn Risk Predictor</CardTitle>
              <CardDescription>
                Simulate customer churn scoring using behavioral and contract signals.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => handleLoadPreset('high')}
                className="text-xs px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              >
                High Risk
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset('low')}
                className="text-xs px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                Low Risk
              </button>
            </div>
          </CardHeader>

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer ID"
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                placeholder="e.g. CUST-9821"
                required
              />

              <Input
                label="Customer Age (Years)"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                min={18}
                max={100}
                required
              />

              <Input
                label="Subscription Duration (Months)"
                type="number"
                value={formData.subscriptionDuration}
                onChange={(e) =>
                  handleInputChange('subscriptionDuration', Number(e.target.value))
                }
                min={1}
                required
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contract Type
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  className="w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="Multi-Year">Multi-Year</option>
                </select>
              </div>

              <Input
                label="Monthly Logins"
                type="number"
                value={formData.monthlyLogins}
                onChange={(e) =>
                  handleInputChange('monthlyLogins', Number(e.target.value))
                }
                min={0}
                required
              />

              <Input
                label="Last Purchase Days Ago"
                type="number"
                value={formData.lastPurchaseDaysAgo}
                onChange={(e) =>
                  handleInputChange('lastPurchaseDaysAgo', Number(e.target.value))
                }
                min={0}
                required
              />

              <Input
                label="App Usage Time (Hours / Month)"
                type="number"
                step="0.1"
                value={formData.appUsageTime}
                onChange={(e) =>
                  handleInputChange('appUsageTime', Number(e.target.value))
                }
                min={0}
                required
              />

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
                label="Discount Usage Percentage (%)"
                type="number"
                value={formData.discountUsagePercentage}
                onChange={(e) =>
                  handleInputChange('discountUsagePercentage', Number(e.target.value))
                }
                min={0}
                max={100}
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

            <div className="pt-2 flex items-center justify-between border-t border-[#1c2638]">
              <span className="text-[11px] text-slate-500 font-mono">
                Ready for POST /api/churn/predict
              </span>
              <Button type="submit" isLoading={loading} variant="primary">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Predict Churn
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
                <CardTitle>Inference Results</CardTitle>
                <CardDescription>
                  Synthesized churn prediction output.
                </CardDescription>
              </div>
              {result && (
                <Badge
                  variant={
                    result.riskLevel === 'High'
                      ? 'high'
                      : result.riskLevel === 'Medium'
                      ? 'medium'
                      : 'low'
                  }
                >
                  {result.riskLevel} Risk
                </Badge>
              )}
            </CardHeader>

            {!result ? (
              <div className="py-14 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Awaiting Prediction Request
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Adjust customer parameters or select a preset, then click Predict Churn to run inference.
                </p>
              </div>
            ) : (
              <div className="space-y-5 mt-2">
                {/* Metric Summary */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0b0f17]/90 border border-[#1f2a3f]">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Churn Risk
                    </span>
                    <span className="text-3xl font-bold text-white font-mono">
                      {result.churnRisk}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Probability Score
                    </span>
                    <span className="text-3xl font-bold text-slate-200 font-mono">
                      {result.churnProbability}
                    </span>
                  </div>
                </div>

                {/* Risk Level Badge & Confidence */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-[#1c2638] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Model Classification:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-mono">
                      Conf: {(result.confidenceScore * 100).toFixed(0)}%
                    </span>
                    <Badge
                      variant={
                        result.riskLevel === 'High'
                          ? 'high'
                          : result.riskLevel === 'Medium'
                          ? 'medium'
                          : 'low'
                      }
                    >
                      {result.riskLevel} Level
                    </Badge>
                  </div>
                </div>

                {/* Primary Drivers */}
                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Top Contributing Factors
                  </h5>
                  <ul className="space-y-2">
                    {result.primaryDrivers.map((driver, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-300 flex items-start gap-2 p-2 rounded bg-slate-900/40 border border-[#1f2a3f]/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Playbook */}
                <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                    Prescribed Retention Playbook
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {result.recommendedPlaybook}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1c2638] mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Saved ML model endpoint connector</span>
            </span>
            <span className="font-mono">POST /api/churn/predict</span>
          </div>
        </Card>
      </div>
    </div>
  );
};