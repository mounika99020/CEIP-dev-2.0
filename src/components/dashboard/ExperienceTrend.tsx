import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ExperienceSignalTrend } from '../../data/demoData';

interface ExperienceTrendProps {
  data: ExperienceSignalTrend[];
}

export const ExperienceTrend: React.FC<ExperienceTrendProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'engagement' | 'sentiment' | 'risk'>('all');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Customer Experience Signals</CardTitle>
          <CardDescription>
            Engagement, sentiment and customer risk trends.
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0b0f17] p-1 rounded-lg border border-[#1f2a3f] text-xs">
          <button
            onClick={() => setActiveMetric('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'all'
                ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('engagement')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'engagement'
                ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => setActiveMetric('sentiment')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'sentiment'
                ? 'bg-teal-500/20 text-teal-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sentiment
          </button>
          <button
            onClick={() => setActiveMetric('risk')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'risk'
                ? 'bg-rose-500/20 text-rose-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-[280px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2a3f" opacity={0.6} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1f2a3f' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1f2a3f' }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111726',
                borderColor: '#24314c',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f1f5f9',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: any) => [`${value}%`, name]}
            />
            {(activeMetric === 'all' || activeMetric === 'engagement') && (
              <Area
                type="monotone"
                dataKey="engagement"
                name="Engagement Score"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#engagementGrad)"
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'sentiment') && (
              <Area
                type="monotone"
                dataKey="sentiment"
                name="Sentiment Index"
                stroke="#14b8a6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sentimentGrad)"
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'risk') && (
              <Area
                type="monotone"
                dataKey="risk"
                name="Churn Risk"
                stroke="#ef4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[#1c2638] px-1 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span>Sentiment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Churn Risk</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Updated continuously</span>
      </div>
    </Card>
  );
};
