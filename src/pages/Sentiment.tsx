import React, { useState } from 'react';
import {
  HeartHandshake,
  MessageSquareQuote,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Sparkles,
  Search,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  DEMO_SENTIMENT_SUMMARY,
  DEMO_SENTIMENT_TRENDS,
  DEMO_SENTIMENT_CATEGORIES,
  DEMO_RECENT_FEEDBACK,
  FeedbackItem,
} from '../data/demoData';
import { formatNumber } from '../lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { analyzeSentiment, SentimentAnalysisResponse } from '../lib/api';

export const Sentiment: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Integration latency caused sync failures during peak operational hours. Escalation response was slow and we are evaluating SLA terms.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SentimentAnalysisResponse | null>(null);

  const [feedbackCategoryFilter, setFeedbackCategoryFilter] =
    useState<string>('All');

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await analyzeSentiment({ text: inputText });
      setAnalysisResult(res);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredFeedback =
    feedbackCategoryFilter === 'All'
      ? DEMO_RECENT_FEEDBACK
      : DEMO_RECENT_FEEDBACK.filter(
          (f) => f.category === feedbackCategoryFilter
        );

  return (
    <PageContainer>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Positive */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Positive Sentiment
              </p>
              <div className="text-3xl font-bold text-teal-400 mt-1 font-mono">
                {DEMO_SENTIMENT_SUMMARY.positive.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Smile className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {formatNumber(DEMO_SENTIMENT_SUMMARY.positive.count)} responses
            </span>
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_SENTIMENT_SUMMARY.positive.trend}
            </span>
          </div>
        </Card>

        {/* Neutral */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Neutral Sentiment
              </p>
              <div className="text-3xl font-bold text-slate-300 mt-1 font-mono">
                {DEMO_SENTIMENT_SUMMARY.neutral.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-500/10 text-slate-400 border border-slate-500/20">
              <Meh className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {formatNumber(DEMO_SENTIMENT_SUMMARY.neutral.count)} responses
            </span>
            <span className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_SENTIMENT_SUMMARY.neutral.trend}
            </span>
          </div>
        </Card>

        {/* Negative */}
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Negative Sentiment
              </p>
              <div className="text-3xl font-bold text-rose-400 mt-1 font-mono">
                {DEMO_SENTIMENT_SUMMARY.negative.percentage}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Frown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {formatNumber(DEMO_SENTIMENT_SUMMARY.negative.count)} responses
            </span>
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_SENTIMENT_SUMMARY.negative.trend} (improved)
            </span>
          </div>
        </Card>
      </div>

      {/* Charts Row: Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment Trend */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col border-[#1c2638]">
            <CardHeader>
              <div>
                <CardTitle>Sentiment Trend Analysis</CardTitle>
                <CardDescription>
                  Longitudinal polarity distribution over weekly telemetry cycles.
                </CardDescription>
              </div>
              <span className="text-xs font-mono text-slate-400">
                6-Week Rolling
              </span>
            </CardHeader>

            <div className="flex-1 w-full min-h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={DEMO_SENTIMENT_TRENDS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111726',
                      borderColor: '#24314c',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f1f5f9',
                    }}
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    fillOpacity={0.4}
                    name="Positive"
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.3}
                    name="Neutral"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.4}
                    name="Negative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Sentiment Distribution by Aspect/Category */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col border-[#1c2638]">
            <CardHeader>
              <div>
                <CardTitle>Aspect Sentiment Breakdown</CardTitle>
                <CardDescription>
                  Polarity breakdown across customer touchpoints.
                </CardDescription>
              </div>
            </CardHeader>

            <div className="flex-1 w-full min-h-[280px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEMO_SENTIMENT_CATEGORIES}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111726',
                      borderColor: '#24314c',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f1f5f9',
                    }}
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                  />
                  <Bar dataKey="positive" stackId="a" fill="#14b8a6" name="Positive" />
                  <Bar dataKey="neutral" stackId="a" fill="#64748b" name="Neutral" />
                  <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Customer Feedback Analyzer Module */}
      <Card className="border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422]">
        <CardHeader>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                NLP Classification Engine
              </span>
            </div>
            <CardTitle>Customer Feedback Analysis</CardTitle>
            <CardDescription>
              Test verbatim customer feedback or complaint text to extract sentiment polarity and actionable insights.
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            POST /api/sentiment/analyze
          </span>
        </CardHeader>

        <form onSubmit={handleRunAnalysis} className="mt-2 space-y-4">
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Enter customer feedback or complaint text..."
              className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Quick tests:</span>
              <button
                type="button"
                onClick={() =>
                  setInputText(
                    'The automated intelligence reporting saved our customer ops team 15 hours weekly. Smooth deployment and exceptional responsiveness.'
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 transition-colors"
              >
                Positive Testimonial
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputText(
                    'Repeated dashboard timeouts during end-of-month reporting. Frustrated by delayed escalation responses.'
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              >
                Negative Escalation
              </button>
            </div>

            <Button type="submit" variant="teal" isLoading={analyzing}>
              <HeartHandshake className="w-4 h-4 mr-2" />
              Analyze Sentiment
            </Button>
          </div>
        </form>

        {/* Result Area */}
        {analysisResult && (
          <div className="mt-5 pt-5 border-t border-[#1c2638] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Classified Sentiment
                </span>
                <div className="mt-1">
                  <Badge
                    size="md"
                    variant={
                      analysisResult.sentiment === 'Positive'
                        ? 'positive'
                        : analysisResult.sentiment === 'Negative'
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {analysisResult.sentiment}
                  </Badge>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Model Confidence
                </span>
                <span className="text-xl font-bold text-white font-mono mt-1 block">
                  {(analysisResult.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[#1f2a3f] sm:col-span-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Pipeline Status
                </span>
                <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Inference Complete
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0f17] border border-[#1f2a3f]">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Extracted Intelligence Insight
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {analysisResult.insight}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Feedback Table */}
      <Card className="border-[#1c2638]">
        <CardHeader>
          <div>
            <CardTitle>Recent Customer Feedback Verbatim</CardTitle>
            <CardDescription>
              Continuous stream of monitored customer feedback entries.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={feedbackCategoryFilter}
              onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
              className="bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Product Usability">Product Usability</option>
              <option value="Performance">Performance</option>
              <option value="Billing & Pricing">Billing & Pricing</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c2638] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer & ID</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Customer Verbatim</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]/60 text-xs">
              {filteredFeedback.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200 block">
                      {item.accountName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.customerId}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300">{item.category}</span>
                  </td>
                  <td className="py-3 px-3 max-w-md">
                    <p className="text-slate-300 line-clamp-2 leading-relaxed">
                      "{item.text}"
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      size="sm"
                      variant={
                        item.sentiment === 'Positive'
                          ? 'positive'
                          : item.sentiment === 'Negative'
                          ? 'negative'
                          : 'neutral'
                      }
                    >
                      {item.sentiment}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {(item.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {item.date}
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