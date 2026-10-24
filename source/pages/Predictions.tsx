import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Cpu,
  ShieldAlert,
  HeartHandshake,
  Target,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChurnPredictionForm } from '../components/predictions/ChurnPredictionForm';
import { SentimentPredictionForm } from '../components/predictions/SentimentPredictionForm';
import { RetentionRecommendationForm } from '../components/predictions/RetentionRecommendationForm';
import { cn } from '../lib/utils';

export const Predictions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'churn' | 'sentiment' | 'retention'>(
    tabParam === 'sentiment'
      ? 'sentiment'
      : tabParam === 'retention'
      ? 'retention'
      : 'churn'
  );

  useEffect(() => {
    if (tabParam && (tabParam === 'churn' || tabParam === 'sentiment' || tabParam === 'retention')) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'churn' | 'sentiment' | 'retention') => {
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
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Prediction Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Use CEIP intelligence models to analyze individual customer signals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-[#1f2a3f]">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>FastAPI Endpoint Architecture Ready</span>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  ? 'bg-[#151e33] border-indigo-500/50 shadow-glowIndigo'
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
      </div>
    </PageContainer>
  );
};