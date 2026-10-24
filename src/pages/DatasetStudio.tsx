import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Plus,
  BarChart3,
  Download,
  Filter,
  Search,
  ShieldAlert,
  HeartHandshake,
  Target,
  Sparkles,
  CheckCircle2,
  Trash2,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useDataset } from '../context/DatasetContext';
import { formatNumber, formatCurrency } from '../lib/utils';

export const DatasetStudio: React.FC = () => {
  const { datasets, activeDatasetId, activeDataset, switchDataset, deleteDataset, openAddModal } =
    useDataset();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Filter records in active dataset
  const records = activeDataset.records || [];
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk =
      selectedRiskFilter === 'all' || r.riskLevel.toLowerCase() === selectedRiskFilter.toLowerCase();
    const matchesSentiment =
      selectedSentimentFilter === 'all' ||
      r.sentiment.toLowerCase() === selectedSentimentFilter.toLowerCase();

    return matchesSearch && matchesRisk && matchesSentiment;
  });

  const handleExportCSV = () => {
    if (records.length === 0) return;

    const headers = [
      'Customer ID',
      'Age',
      'Gender',
      'Region',
      'Contract Type',
      'Monthly Charges',
      'Predicted Churn',
      'Churn Probability %',
      'Risk Level',
      'Primary Driver',
      'Sentiment',
      'Star Rating',
      'Recommended Action',
      'Salvageable ARR',
    ];

    const csvRows = records.map((r) => [
      r.customerId,
      r.age,
      r.gender,
      r.region,
      `"${r.contractType}"`,
      r.monthlyCharges,
      r.predictedChurn,
      r.churnProbability,
      r.riskLevel,
      `"${r.primaryChurnDriver}"`,
      r.sentiment,
      r.starRating,
      `"${r.recommendedAction}"`,
      r.salvageableArr,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvRows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDataset.name.replace(/\s+/g, '_')}_predictions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2638] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Dataset Intelligence Studio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {datasets.length} Datasets Loaded
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dataset Management &amp; Batch Predictions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new customer cohorts, execute multi-model AI predictions, and switch datasets to monetize both portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="sm" onClick={openAddModal}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Dataset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/power-bi')}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Open in Power BI
          </Button>

          {records.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Available Datasets &amp; Monetization Status
          </span>
          <span className="text-xs text-slate-500">
            Click 'Set Active' to switch the dataset displayed in Power BI &amp; Analytics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((ds) => {
            const isActive = ds.id === activeDatasetId;

            return (
              <Card
                key={ds.id}
                className={`p-5 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-500 bg-[#151e33] shadow-glowIndigo ring-1 ring-indigo-500/30'
                    : 'border-[#1c2638] bg-[#0d121c] hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {ds.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 block">
                          {ds.uploadedAt} • {formatNumber(ds.customerCount)} Customers
                        </span>
                      </div>
                    </div>

                    {isActive ? (
                      <Badge variant="positive" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active in BI
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => switchDataset(ds.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Set Active
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {ds.description}
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#1c2638] text-center">
                    <div className="bg-[#111726] p-2 rounded-lg border border-[#1f2a3f]">
                      <span className="text-[10px] text-slate-500 block">Churn Rate</span>
                      <span className="text-xs font-bold text-rose-400">
                        {ds.metrics.churnRate}%
                      </span>
                    </div>
                    <div className="bg-[#111726] p-2 rounded-lg border border-[#1f2a3f]">
                      <span className="text-[10px] text-slate-500 block">Sentiment</span>
                      <span className="text-xs font-bold text-teal-400">
                        {ds.metrics.positiveSentimentPercent}%
                      </span>
                    </div>
                    <div className="bg-[#111726] p-2 rounded-lg border border-[#1f2a3f]">
                      <span className="text-[10px] text-slate-500 block">Salvageable</span>
                      <span className="text-xs font-bold text-emerald-400">
                        ${(ds.metrics.salvageableArr / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a2336] flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    ARR: <strong className="text-slate-300">{formatCurrency(ds.metrics.totalRevenue)}</strong>
                  </span>

                  {ds.sourceType === 'custom_upload' && (
                    <button
                      onClick={() => deleteDataset(ds.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete dataset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Dataset Overview & Predictions Table */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Predictions Table: {activeDataset.name}</span>
              <Badge variant="info" size="sm">
                {records.length} Evaluated Records
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live batch inference outputs for Churn probability, NLP review polarity, and prescriptive Retention actions.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, region, contract..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111726] border border-[#1f2a3f] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-[#111726] border border-[#1f2a3f] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk Only</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <select
              value={selectedSentimentFilter}
              onChange={(e) => setSelectedSentimentFilter(e.target.value)}
              className="bg-[#111726] border border-[#1f2a3f] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <Card className="border-[#1c2638] bg-[#0d121c] overflow-hidden shadow-xl">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              {records.length === 0 ? (
                <div>
                  <Database className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-200">
                    This is the baseline model dataset.
                  </p>
                  <p className="mt-1">
                    Click "Add Dataset" to upload or select the 500-customer BCA unseen dataset to view record-by-record predictions.
                  </p>
                  <Button variant="primary" size="sm" onClick={openAddModal} className="mt-4">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Load Unseen Dataset
                  </Button>
                </div>
              ) : (
                'No customer records match your filter criteria.'
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111726] border-b border-[#1f2a3f] text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Customer ID</th>
                    <th className="py-3 px-3">Region &amp; Contract</th>
                    <th className="py-3 px-3">Monthly Spend</th>
                    <th className="py-3 px-3">Churn Probability</th>
                    <th className="py-3 px-3">Sentiment &amp; Stars</th>
                    <th className="py-3 px-3">Primary Driver</th>
                    <th className="py-3 px-3">Recommended Playbook</th>
                    <th className="py-3 px-4 text-right">Salvageable ARR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2a3f]/50 text-slate-300">
                  {filteredRecords.slice(0, 50).map((row) => (
                    <tr
                      key={row.customerId}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-200">
                        {row.customerId}
                        <span className="block text-[10px] text-slate-500 font-sans">
                          {row.gender}, {row.age} yrs
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-200">{row.region}</span>
                        <span className="block text-[10px] text-slate-400">
                          {row.contractType}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        ${row.monthlyCharges.toFixed(2)}/mo
                        <span className="block text-[10px] text-slate-500">
                          ARR: ${(row.monthlyCharges * 12).toFixed(0)}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            size="sm"
                            variant={
                              row.riskLevel === 'High'
                                ? 'high'
                                : row.riskLevel === 'Medium'
                                ? 'medium'
                                : 'low'
                            }
                          >
                            {row.churnProbability}% • {row.riskLevel}
                          </Badge>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              row.sentiment === 'Positive'
                                ? 'bg-teal-400'
                                : row.sentiment === 'Negative'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span className="font-medium text-slate-200">
                            {row.sentiment}
                          </span>
                          <span className="text-[10px] text-amber-400 font-bold ml-1">
                            {'★'.repeat(row.starRating)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs truncate" title={row.primaryChurnDriver}>
                        {row.primaryChurnDriver}
                      </td>

                      <td className="py-3 px-3 text-[11px] text-indigo-300 max-w-xs truncate" title={row.recommendedAction}>
                        {row.recommendedAction}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                        {row.salvageableArr > 0 ? `$${Math.round(row.salvageableArr).toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredRecords.length > 50 && (
            <div className="p-3 bg-[#111726] border-t border-[#1f2a3f] text-center text-xs text-slate-500">
              Showing first 50 of {filteredRecords.length} records. Export CSV to analyze all rows.
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default DatasetStudio;
