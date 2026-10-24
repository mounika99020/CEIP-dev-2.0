import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  Settings,
  ShieldCheck,
  Info,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Filter,
  Database,
  TrendingUp,
  Users,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Plus,
  ArrowRight,
  Activity,
  DollarSign,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useDataset, BASELINE_DATASET } from '../context/DatasetContext';
import { formatNumber, formatCurrency } from '../lib/utils';

const CONNECTED_DATASETS = [
  {
    name: 'OnlineRetail_Cleaned.xls',
    records: '541,909 rows',
    role: 'Financial Transactions & Revenue',
    status: 'Cleaned & Modeled',
  },
  {
    name: 'Ecommerce_Customer_Churn_Cleaned.xls',
    records: '3,000 customers',
    role: 'Customer Demographics & Churn Target',
    status: 'Feature Engineered',
  },
  {
    name: 'Customer_Support_Tickets_Cleaned.xls',
    records: '200,000 records',
    role: 'Service Resolution Telemetry',
    status: 'Indexed',
  },
  {
    name: 'Amazon_Product_Cleaned.xls',
    records: '2,200 reviews',
    role: 'NLP Sentiment & Star Ratings',
    status: 'Tokenized',
  },
  {
    name: 'Marketing_Campaign_Cleaned.xls',
    records: '2,240 campaigns',
    role: 'Channel Attribution & ROI',
    status: 'Integrated',
  },
  {
    name: 'Consumer_Complaints_Cleaned.xls',
    records: '150,000 complaints',
    role: 'Regulatory & High Friction Audits',
    status: 'Active',
  },
];

// Sample public Power BI report link for testing/demonstration
const SAMPLE_POWERBI_URL =
  'https://app.powerbi.com/view?r=eyJrIjoiOGU0MzE5NTMtNGNiZi00NGFhLTgxZDktZGY5YjYwZWIwNmZjIiwidCI6IjI4MGYxM2YxLThmYjUtNGMxOC1iZmQ3LWI1MWQ0Y2RhNjQ1MCIsImMiOjEwfQ%3D%3D';

export const PowerBI: React.FC = () => {
  const { datasets, activeDatasetId, activeDataset, switchDataset, openAddModal } = useDataset();

  const [activeTab, setActiveTab] = useState<'interactive' | 'embed'>('interactive');
  const [selectedReportPage, setSelectedReportPage] = useState<string>('executive');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string>(() => {
    return localStorage.getItem('ceip_powerbi_embed_url') || '';
  });
  const [urlInput, setUrlInput] = useState<string>(() => {
    return localStorage.getItem('ceip_powerbi_embed_url') || '';
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFilterRegion, setSelectedFilterRegion] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('ceip_powerbi_embed_url', embedUrl);
  }, [embedUrl]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setEmbedUrl(urlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleUseSampleUrl = () => {
    setUrlInput(SAMPLE_POWERBI_URL);
    setEmbedUrl(SAMPLE_POWERBI_URL);
    setActiveTab('embed');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById('powerbi-viewport-container');
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const metrics = activeDataset.metrics;
  const isCustomOrUnseen = activeDataset.id !== BASELINE_DATASET.id;

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#1c2638] gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
              Power BI Embedded Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              Active: <strong className="text-white">{activeDataset.name}</strong> ({activeDataset.customerCount} records)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Business Intelligence &amp; Power BI
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-dataset analytics, customer metrics, and Microsoft Power BI cloud reporting.
          </p>
        </div>

        {/* View Mode Toggle, Dataset Switcher & Primary Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Dataset Selector Dropdown */}
          <div className="bg-[#111726] border border-[#1f2a3f] rounded-lg px-2.5 py-1 text-xs flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Dataset:</span>
            <select
              value={activeDatasetId}
              onChange={(e) => switchDataset(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id} className="bg-[#0d121c] text-slate-200">
                  {ds.name} ({ds.customerCount})
                </option>
              ))}
            </select>
          </div>

          {/* + Add Dataset Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            className="shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Dataset
          </Button>

          {/* Mode Switcher */}
          <div className="bg-[#111726] p-1 rounded-lg border border-[#1f2a3f] flex items-center text-xs">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'interactive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Interactive Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'embed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Power BI Web Embed</span>
              {embedUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Data
          </Button>

          {embedUrl && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(embedUrl, '_blank')}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Open Live BI
            </Button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NATIVE INTERACTIVE POWER BI DASHBOARD VIEW        */}
      {/* ======================================================== */}
      {activeTab === 'interactive' && (
        <div className="space-y-6">
          {/* Sub-bar: Power BI Page Tabs & Filter Slicer */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Report Pages:
              </span>
              <button
                onClick={() => setSelectedReportPage('executive')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  selectedReportPage === 'executive'
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Executive Overview</span>
              </button>
              <button
                onClick={() => setSelectedReportPage('churn')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  selectedReportPage === 'churn'
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Churn Cohorts &amp; Retention</span>
              </button>
              <button
                onClick={() => setSelectedReportPage('monetization')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  selectedReportPage === 'monetization'
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monetization &amp; Comparison</span>
              </button>
              <button
                onClick={() => setSelectedReportPage('telemetry')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  selectedReportPage === 'telemetry'
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Dataset Lineage</span>
              </button>
            </div>

            {/* Region / Market Slicer */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Market Filter:</span>
              <select
                value={selectedFilterRegion}
                onChange={(e) => setSelectedFilterRegion(e.target.value)}
                className="bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">Global Markets (All)</option>
                <option value="uk">United Kingdom (Primary)</option>
                <option value="eu">European Union</option>
                <option value="na">North America</option>
              </select>
            </div>
          </div>

          {/* 4 Core Power BI KPI Cards (Dynamically linked to active dataset) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Customers */}
            <Card className="border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422] p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Total Ecommerce Customers
                </span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                {formatNumber(metrics.totalCustomers)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold flex items-center">
                  {metrics.churnRate}% churn risk
                </span>
                <span>Active monitored accounts</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#1c2638] pt-1.5 truncate">
                Source: {activeDataset.name}
              </div>
            </Card>

            {/* Card 2: Average Monthly Spend */}
            <Card className="border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422] p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Average Monthly Spend
                </span>
                <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                ${metrics.avgMonthlySpend.toFixed(2)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">
                  ${(metrics.avgMonthlySpend * 12).toFixed(0)} ARR/acct
                </span>
                <span>Average monthly charges</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#1c2638] pt-1.5">
                Measure: [Average Monthly Spend]
              </div>
            </Card>

            {/* Card 3: Total Support Tickets */}
            <Card className="border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422] p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Total Support Tickets
                </span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                {formatNumber(metrics.totalSupportTickets)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-teal-400 font-semibold">
                  {metrics.positiveSentimentPercent}%
                </span>
                <span>Positive sentiment index</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#1c2638] pt-1.5">
                Telemetry Resolution Rate: 91.4%
              </div>
            </Card>

            {/* Card 4: Retail Revenue / Monitored ARR */}
            <Card className="border-[#1c2638] bg-gradient-to-br from-[#111726] to-[#0e1422] p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Monitored Retail Revenue
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BarChart3 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                {formatCurrency(metrics.totalRevenue)}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">
                  {formatCurrency(metrics.salvageableArr)}
                </span>
                <span>Salvageable ARR opportunity</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 border-t border-[#1c2638] pt-1.5">
                Measure: [Retail Revenue] / Model ARR
              </div>
            </Card>
          </div>

          {/* PAGE 1: EXECUTIVE OVERVIEW */}
          {selectedReportPage === 'executive' && (
            <div className="space-y-6">
              {/* Row 1: Clustered Bar Chart & Clustered Column Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual: Revenue by Region / Country */}
                <div className="lg:col-span-7">
                  <Card className="border-[#1c2638] bg-[#0d121c] p-5 h-full flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#1c2638]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                              Regional Revenue Breakdown
                            </span>
                            <span className="text-xs text-slate-500">Clustered Bar Chart</span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">
                            Revenue by Geography / Market
                          </h3>
                          <p className="text-xs text-slate-400">
                            Volume distribution for dataset: {activeDataset.name}
                          </p>
                        </div>
                        <Badge size="sm" variant="info">
                          {metrics.regionalBreakdown.length} Markets
                        </Badge>
                      </div>

                      <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={metrics.regionalBreakdown}
                            margin={{ top: 10, right: 25, left: 60, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" horizontal={false} />
                            <XAxis
                              type="number"
                              stroke="#64748b"
                              fontSize={11}
                              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                            />
                            <YAxis
                              type="category"
                              dataKey="region"
                              stroke="#94a3b8"
                              fontSize={11}
                              tickLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0d121c',
                                borderColor: '#1f2a3f',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#f1f5f9',
                              }}
                              formatter={(value: number) => [
                                formatCurrency(value),
                                'Monitored Revenue',
                              ]}
                            />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]}>
                              {metrics.regionalBreakdown.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={index === 0 ? '#6366f1' : index === 1 ? '#38bdf8' : '#2dd4bf'}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1a2336] flex items-center justify-between text-xs text-slate-400">
                      <span>Top Market: {metrics.regionalBreakdown[0]?.region || 'N/A'}</span>
                      <span className="font-mono text-indigo-400 font-medium">
                        {metrics.regionalBreakdown[0] ? formatCurrency(metrics.regionalBreakdown[0].revenue) : '$0'}
                      </span>
                    </div>
                  </Card>
                </div>

                {/* Visual: Customer Reviews by Star Rating */}
                <div className="lg:col-span-5">
                  <Card className="border-[#1c2638] bg-[#0d121c] p-5 h-full flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#1c2638]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                              Review Sentiment Model
                            </span>
                            <span className="text-xs text-slate-500">Clustered Column</span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">
                            Review Ratings &amp; Sentiment Distribution
                          </h3>
                          <p className="text-xs text-slate-400">
                            NLP classified review distribution
                          </p>
                        </div>
                        <Badge size="sm" variant="positive">
                          {metrics.positiveSentimentPercent}% Positive
                        </Badge>
                      </div>

                      <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.ratingBreakdown}
                            margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                            <XAxis dataKey="rating" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0d121c',
                                borderColor: '#1f2a3f',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#f1f5f9',
                              }}
                              formatter={(value: number, _name: string, props: any) => [
                                `${value} reviews (${props.payload.sentiment})`,
                                'Review Count',
                              ]}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {metrics.ratingBreakdown.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1a2336] flex items-center justify-between text-xs text-slate-400">
                      <span>Positive customer satisfaction index:</span>
                      <span className="font-mono text-emerald-400 font-medium">
                        {metrics.positiveSentimentPercent}%
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Row 2: Customer Support Tickets by Priority & Status */}
              <Card className="border-[#1c2638] bg-[#0d121c] p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c2638] gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                        Support Telemetry
                      </span>
                      <span className="text-xs text-slate-500">Multi-Series Telemetry</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">
                      Support Ticket Volume by Priority &amp; Resolution Status
                    </h3>
                    <p className="text-xs text-slate-400">
                      Operational telemetry mapping Critical, High, Medium, and Low tier service tickets
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                      Resolved
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                      In Progress
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                      Open
                    </span>
                  </div>
                </div>

                <div className="h-72 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.ticketBreakdown}
                      margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                      <XAxis dataKey="priority" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d121c',
                          borderColor: '#1f2a3f',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#f1f5f9',
                        }}
                      />
                      <Bar dataKey="Resolved" fill="#10b981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="InProgress" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Open" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a2336] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-4">
                    <span>Critical Open Queue: {metrics.ticketBreakdown[0]?.Open || 0} cases</span>
                    <span>•</span>
                    <span>High Risk Accounts: {metrics.highRiskCount}</span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    Dataset: {activeDataset.name}
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* PAGE 2: CHURN COHORTS & RETENTION */}
          {selectedReportPage === 'churn' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <Card className="border-[#1c2638] bg-[#0d121c] p-5 shadow-xl">
                    <CardHeader>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
                            Contract Lifecycle Analysis
                          </span>
                        </div>
                        <CardTitle>Churn Rate by Contract Type</CardTitle>
                        <CardDescription>
                          Evaluated against active cohort: {activeDataset.name}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <div className="h-64 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={metrics.contractBreakdown}
                          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                          <XAxis dataKey="contract" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={11} unit="%" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0d121c',
                              borderColor: '#1f2a3f',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: '#f1f5f9',
                            }}
                            formatter={(val: number) => [`${val}%`, 'Churn Rate']}
                          />
                          <Bar dataKey="churnRate" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#1c2638] pt-3 text-xs">
                      {metrics.contractBreakdown.map((c) => (
                        <div key={c.contract}>
                          <span className="text-slate-400 block">{c.contract}</span>
                          <span className="text-rose-400 font-bold text-sm">
                            {c.churnRate}% Churn
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {c.activeCount} active / {c.churnedCount} churned
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-5">
                  <Card className="border-[#1c2638] bg-[#0d121c] p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <CardHeader>
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                            Retention Prescriptive Actions
                          </span>
                          <CardTitle className="mt-1">High-Risk Customer Interventions</CardTitle>
                          <CardDescription>
                            Top drivers contributing to customer churn score
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <div className="space-y-3 mt-3">
                        <div className="p-3 rounded-lg bg-[#111726] border border-[#1f2a3f] flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-200">
                              Support Call Spikes (&gt; 3 calls)
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              Increases churn probability by 3.8x
                            </span>
                          </div>
                          <Badge variant="high" size="sm">
                            Critical Risk
                          </Badge>
                        </div>

                        <div className="p-3 rounded-lg bg-[#111726] border border-[#1f2a3f] flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-200">
                              Late Payment Occurrence
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              Triggers billing friction risk alert
                            </span>
                          </div>
                          <Badge variant="medium" size="sm">
                            High Risk
                          </Badge>
                        </div>

                        <div className="p-3 rounded-lg bg-[#111726] border border-[#1f2a3f] flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-200">
                              Month-to-Month Contract Tier
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              Elevated voluntary departure rate
                            </span>
                          </div>
                          <Badge variant="info" size="sm">
                            Conversion Target
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1c2638] flex items-center justify-between text-xs text-slate-400">
                      <span>Salvageable ARR for this cohort:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {formatCurrency(metrics.salvageableArr)}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: DATASET MONETIZATION & COMPARISON (Requested Feature!) */}
          {selectedReportPage === 'monetization' && (
            <div className="space-y-6">
              <Card className="border-[#1c2638] bg-[#0d121c] p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c2638] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        Cross-Dataset Monetization Engine
                      </span>
                      <span className="text-xs text-slate-500">Comparative ROI Matrix</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      Dataset Portfolio Monetization &amp; Comparative Analysis
                    </h3>
                    <p className="text-xs text-slate-400">
                      Compare baseline production telemetry with new customer cohorts to maximize retained revenue.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm" onClick={openAddModal}>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Another Cohort
                    </Button>
                  </div>
                </div>

                {/* Side by side comparison cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Baseline Column */}
                  <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2a3f] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <h4 className="text-sm font-bold text-white">
                          Baseline Production Model
                        </h4>
                      </div>
                      <Badge variant="info" size="sm">
                        Primary Warehouse
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Audited Customer Base</span>
                        <span className="text-slate-200 font-bold">3,000 Accounts</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Monitored Retail Revenue</span>
                        <span className="text-emerald-400 font-bold">$9,742,890</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Baseline Churn Risk</span>
                        <span className="text-rose-400 font-bold">16.8%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Positive Review Sentiment</span>
                        <span className="text-teal-400 font-bold">78.4%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Salvageable ARR</span>
                        <span className="text-emerald-400 font-bold">$1,036,000</span>
                      </div>
                    </div>

                    <Button
                      variant={activeDatasetId === BASELINE_DATASET.id ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => switchDataset(BASELINE_DATASET.id)}
                      className="w-full text-xs mt-2"
                    >
                      {activeDatasetId === BASELINE_DATASET.id ? 'Currently Active in BI' : 'Switch to Baseline'}
                    </Button>
                  </div>

                  {/* Active/New Dataset Column */}
                  <div className="p-4 rounded-xl bg-[#111726] border border-indigo-500/40 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h4 className="text-sm font-bold text-white truncate max-w-xs">
                          {activeDataset.name}
                        </h4>
                      </div>
                      <Badge variant="positive" size="sm">
                        Evaluated Cohort
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Audited Customer Base</span>
                        <span className="text-slate-200 font-bold">
                          {formatNumber(activeDataset.customerCount)} Accounts
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Cohort ARR Value</span>
                        <span className="text-emerald-400 font-bold">
                          {formatCurrency(metrics.totalRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Predicted Churn Rate</span>
                        <span className="text-rose-400 font-bold">{metrics.churnRate}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#1c2638]">
                        <span className="text-slate-400">Positive Review Sentiment</span>
                        <span className="text-teal-400 font-bold">
                          {metrics.positiveSentimentPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Salvageable ARR</span>
                        <span className="text-emerald-400 font-bold">
                          {formatCurrency(metrics.salvageableArr)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                      <span>Incremental Monetization:</span>
                      <strong className="font-mono text-white">
                        +{formatCurrency(metrics.salvageableArr)} Recoverable
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Combined Portfolio Strip */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 via-slate-900 to-emerald-900/30 border border-[#1f2a3f] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Combined Portfolio Valuation
                      </h4>
                      <p className="text-xs text-slate-400">
                        Total value of baseline production and evaluated customer datasets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Monitored ARR</span>
                      <span className="text-base font-bold text-white">
                        {formatCurrency(BASELINE_DATASET.metrics.totalRevenue + metrics.totalRevenue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Salvageable ARR</span>
                      <span className="text-base font-bold text-emerald-400">
                        {formatCurrency(BASELINE_DATASET.metrics.salvageableArr + metrics.salvageableArr)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* PAGE 4: DATASET LINEAGE & TELEMETRY */}
          {selectedReportPage === 'telemetry' && (
            <Card className="border-[#1c2638] bg-[#0d121c] p-5 shadow-xl">
              <div className="pb-3 border-b border-[#1c2638]">
                <h3 className="text-sm font-bold text-white">
                  CEIP Multi-Dataset Warehouse Lineage
                </h3>
                <p className="text-xs text-slate-400">
                  Six primary data sources ingested, preprocessed, and linked into the Power BI star schema
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONNECTED_DATASETS.map((ds) => (
                  <div
                    key={ds.name}
                    className="p-4 rounded-xl bg-[#111726] border border-[#1f2a3f] hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <FileSpreadsheet className="w-4 h-4" />
                      </span>
                      <Badge variant="low" size="sm">
                        {ds.status}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 font-mono">
                      {ds.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {ds.role}
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#1c2638] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Volume</span>
                      <span className="text-slate-300 font-mono font-medium">{ds.records}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE POWER BI WEB EMBED (IFRAME CONTAINER)        */}
      {/* ======================================================== */}
      {activeTab === 'embed' && (
        <div className="space-y-6">
          {/* Embed URL Configuration Bar */}
          <Card className="border-[#1c2638] bg-[#111726] p-4 shadow-lg">
            <form onSubmit={handleSaveUrl} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Microsoft Power BI Report URL Configuration
                  </h4>
                </div>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    URL Updated &amp; Saved!
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="Paste your Power BI Publish-to-Web or Embed URL (e.g., https://app.powerbi.com/view?r=...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Button type="submit" variant="primary" size="sm">
                  Connect URL
                </Button>
                {embedUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmbedUrl('');
                      setUrlInput('');
                      localStorage.removeItem('ceip_powerbi_embed_url');
                    }}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleUseSampleUrl}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                  Sample Power BI
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  Tip: In Power BI Desktop / Service, choose <strong>File &gt; Embed report &gt; Publish to web (public)</strong> and paste the link here.
                </span>
              </p>
            </form>
          </Card>

          {/* Embedded Power BI Container */}
          <div
            id="powerbi-viewport-container"
            className={`relative rounded-xl border border-[#1c2638] bg-[#0d121c] overflow-hidden shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[620px] flex flex-col justify-between'
            }`}
          >
            {/* Viewport Top Header */}
            <div className="px-5 py-3 bg-[#111726] border-b border-[#1f2a3f] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Microsoft Power BI Live Viewport
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {embedUrl ? 'Status: Stream Active' : 'Awaiting Integration Embed Link'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {embedUrl && (
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                )}
                <Badge size="sm" variant={embedUrl ? 'positive' : 'info'}>
                  {embedUrl ? 'Connected' : 'Ready for URL'}
                </Badge>
              </div>
            </div>

            {/* Viewport Content */}
            {embedUrl ? (
              <div className="flex-1 w-full h-[620px]">
                <iframe
                  src={embedUrl}
                  title="Microsoft Power BI Embedded Dashboard"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-12">
                <div className="w-16 h-16 rounded-2xl bg-[#141b2a] border border-[#24314c] flex items-center justify-center text-indigo-400 shadow-xl mb-4">
                  <BarChart3 className="w-8 h-8 text-indigo-400" />
                </div>

                <h4 className="text-base font-semibold text-slate-100 tracking-tight">
                  Power BI Live Stream Container
                </h4>

                <p className="text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
                  Power BI report will be connected during system integration, or click below to immediately test with the sample live Power BI dashboard.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleUseSampleUrl}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Load Sample Power BI Report
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setActiveTab('interactive')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Built-in CEIP Dashboard
                  </Button>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Ready for Power BI Service REST API &amp; Publish to Web iframes.
                  </span>
                </div>
              </div>
            )}

            {/* Viewport Footer */}
            <div className="px-5 py-2.5 bg-[#090d15] border-t border-[#1a2336] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span>Protocol: HTTPS Direct IFrame</span>
                <span>•</span>
                <span>Sandbox: allow-scripts allow-same-origin</span>
              </div>
              <span className="font-mono">Container ID: pbi-embed-ceip-01</span>
            </div>
          </div>
        </div>
      )}

      {/* Local Power BI File Reference Footer Banner */}
      <div className="p-4 rounded-xl bg-[#0f1523] border border-[#1f2a3f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Desktop Report Source: PowerBI CEIP Report.pbix
            </div>
            <div className="text-[11px] text-slate-400">
              Location: <code>5TH Semester BCA Project\PowerBI CEIP Report.pbix</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alert(
                'Power BI file location:\nC:\\Users\\Admin\\OneDrive\\Desktop\\5TH Semester BCA Project\\PowerBI CEIP Report.pbix\n\nYou can double-click this file on your Desktop to open it directly in Microsoft Power BI Desktop.'
              );
            }}
          >
            <Info className="w-3.5 h-3.5 mr-1.5" />
            File Path Info
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default PowerBI;