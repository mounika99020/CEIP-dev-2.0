import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ShieldAlert,
  HeartHandshake,
  Target,
  Sparkles,
  Layers,
  Info,
  Database,
  Plus,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChurnPredictionForm } from '../components/predictions/ChurnPredictionForm';
import { SentimentPredictionForm } from '../components/predictions/SentimentPredictionForm';
import { RetentionRecommendationForm } from '../components/predictions/RetentionRecommendationForm';
import { useDataset } from '../context/DatasetContext';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn, formatNumber, formatCurrency } from '../lib/utils';

export const Predictions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const navigate = useNavigate();
  const { datasets, activeDataset, openAddModal, switchDataset } = useDataset();

  const [activeTab, setActiveTab] = useState<'churn' | 'sentiment' | 'retention' | 'batch'>(
    tabParam === 'sentiment'
      ? 'sentiment'
      : tabParam === 'retention'
      ? 'retention'
      : tabParam === 'batch'
      ? 'batch'
      : 'churn'
  );

  useEffect(() => {
    if (tabParam && ['churn', 'sentiment', 'retention', 'batch'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'churn' | 'sentiment' | 'retention' | 'batch') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    {
      id: 'churn' as const,
      label: 'Churn Risk Prediction',
      icon: ShieldAlert,
      badge: 'ML Classification',
      desc: 'Predict customer churn probability from behavioral signals',
    },
    {
      id: 'sentiment' as const,
      label: 'Sentiment Analysis',
      icon: HeartHandshake,
      badge: 'NLP Sentiment',
      desc: 'Analyze customer feedback text and sentiment polarity',
    },
    {
      id: 'retention' as const,
      label: 'Retention Recommendation',
      icon: Target,
      badge: 'Decision Engine',
      desc: 'Generate prescriptive intervention playbooks',
    },
    {
      id: 'batch' as const,
      label: 'Batch Dataset Inference',
      icon: Database,
      badge: 'Multi-Model Batch',
      desc: 'Predict churn, sentiment & retention across an entire cohort',
    },
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2638] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Interactive Inference Studio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Active Dataset: {activeDataset.name}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Prediction Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Use CEIP intelligence models to analyze individual customers or score entire uploaded datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={openAddModal}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Dataset
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/datasets')}>
            <Database className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Dataset Studio
          </Button>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between',
                isActive
                  ? 'bg-[#151e33] border-indigo-500/50 shadow-glowIndigo ring-1 ring-indigo-500/30'
                  : 'bg-[#111726]/70 border-[#1c2638] hover:border-slate-600'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={cn(
                    'p-2 rounded-lg border',
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded border',
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  )}
                >
                  {tab.badge}
                </span>
              </div>

              <div>
                <h4
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    isActive ? 'text-white' : 'text-slate-300'
                  )}
                >
                  {tab.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {tab.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Prediction Module */}
      <div className="pt-2">
        {activeTab === 'churn' && <ChurnPredictionForm />}
        {activeTab === 'sentiment' && <SentimentPredictionForm />}
        {activeTab === 'retention' && <RetentionRecommendationForm />}
        {activeTab === 'batch' && (
          <Card className="border-[#1c2638] bg-[#0d121c] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2638] gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    Batch Inference Engine
                  </span>
                </div>
                <CardTitle>Batch Dataset Prediction &amp; Scoring</CardTitle>
                <CardDescription>
                  Upload your customer dataset (CSV/JSON) or load the unseen BCA cohort to run simultaneous Churn, Sentiment, and Retention scoring.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" onClick={openAddModal}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add &amp; Predict New Dataset
                </Button>
              </div>
            </div>

            {/* Currently Active Dataset Card */}
            <div className="p-4 rounded-xl bg-[#111726] border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Active: {activeDataset.name}
                    </h4>
                    <Badge variant="positive" size="sm">
                      {activeDataset.customerCount} Accounts
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeDataset.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/datasets')}
                >
                  View Records Table
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/power-bi')}
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  View in Power BI
                </Button>
              </div>
            </div>

            {/* 4 Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Total Customers</span>
                <span className="text-xl font-bold text-white">{formatNumber(activeDataset.metrics.totalCustomers)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Predicted Churn Rate</span>
                <span className="text-xl font-bold text-rose-400">{activeDataset.metrics.churnRate}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Positive Sentiment</span>
                <span className="text-xl font-bold text-teal-400">{activeDataset.metrics.positiveSentimentPercent}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Salvageable ARR</span>
                <span className="text-xl font-bold text-emerald-400">{formatCurrency(activeDataset.metrics.salvageableArr)}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default Predictions;