import React, { useState } from 'react';
import {
  ShieldAlert,
  MessageSquareWarning,
  Sparkles,
  Activity,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DEMO_RECENT_INSIGHTS, RecentInsight } from '../../data/demoData';
import { useNavigate } from 'react-router-dom';

export const RecentInsights: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const navigate = useNavigate();

  const categories = [
    'All',
    'Churn Risk Increase',
    'Negative Sentiment',
    'Retention Opportunity',
    'Customer Experience Signal',
  ];

  const filteredInsights =
    selectedFilter === 'All'
      ? DEMO_RECENT_INSIGHTS
      : DEMO_RECENT_INSIGHTS.filter((i) => i.category === selectedFilter);

  const getCategoryIcon = (cat: RecentInsight['category']) => {
    switch (cat) {
      case 'Churn Risk Increase':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Negative Sentiment':
        return <MessageSquareWarning className="w-4 h-4 text-amber-400" />;
      case 'Retention Opportunity':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'Customer Experience Signal':
        return <Activity className="w-4 h-4 text-teal-400" />;
    }
  };

  const getCategoryBadgeVariant = (cat: RecentInsight['category']) => {
    switch (cat) {
      case 'Churn Risk Increase':
        return 'high';
      case 'Negative Sentiment':
        return 'medium';
      case 'Retention Opportunity':
        return 'info';
      case 'Customer Experience Signal':
        return 'positive';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Recent Intelligence</CardTitle>
          <CardDescription>
            High-priority customer signals detected across intelligence streams.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 divide-y divide-[#1c2638] overflow-y-auto">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 rounded-lg transition-colors group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-slate-900 border border-[#1f2a3f] mt-0.5 shrink-0">
                {getCategoryIcon(insight.category)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {insight.accountName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {insight.customerId}
                  </span>
                  <Badge size="sm" variant={getCategoryBadgeVariant(insight.category)}>
                    {insight.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                  {insight.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-11 sm:pl-0">
              <div className="text-right">
                <span className="block text-xs font-mono font-medium text-slate-300">
                  {insight.metric}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {insight.timestamp}
                </span>
              </div>
              <button
                onClick={() => navigate('/retention')}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="View in Retention Intelligence"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};