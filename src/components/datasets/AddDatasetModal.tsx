import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Target,
  RefreshCw,
} from 'lucide-react';
import { useDataset, runBatchInferenceOnRows } from '../../context/DatasetContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import unseenCustomersRaw from '../../data/unseenCustomers.json';

export const AddDatasetModal: React.FC = () => {
  const { isAddModalOpen, closeAddModal, addDataset, switchDataset } = useDataset();
  const [activeInputTab, setActiveInputTab] = useState<'presets' | 'upload' | 'paste'>('presets');
  const [datasetName, setDatasetName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedDatasetId, setCompletedDatasetId] = useState<string | null>(null);
  const [completedStats, setCompletedStats] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!isAddModalOpen) return null;

  const handleReset = () => {
    setParsedRows([]);
    setUploadError(null);
    setCompletedDatasetId(null);
    setCompletedStats(null);
    setDatasetName('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    handleReset();
    closeAddModal();
  };

  // Helper to parse CSV string into array of objects
  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Parse header row
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quotes with commas inside
      const values: string[] = [];
      let insideQuotes = false;
      let currentVal = '';

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === "'") {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] !== undefined ? values[idx] : '';
      });
      results.push(rowObj);
    }

    return results;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setParsedRows(parsed);
            setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
          } else {
            setUploadError('JSON file must contain an array of customer records.');
          }
        } else {
          const rows = parseCSV(content);
          if (rows.length > 0) {
            setParsedRows(rows);
            setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
          } else {
            setUploadError('Could not extract rows from CSV file. Please verify CSV formatting.');
          }
        }
      } catch (err: any) {
        setUploadError(`Error reading file: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  const handleSelectPreset = (type: 'bca_unseen' | 'expansion') => {
    setUploadError(null);
    if (type === 'bca_unseen') {
      setParsedRows(unseenCustomersRaw as any[]);
      setDatasetName('Unseen BCA Validation Cohort (500 Customers)');
    } else {
      // Generate 250 enterprise expansion customers
      const sample = (unseenCustomersRaw as any[]).slice(0, 250).map((r, i) => ({
        ...r,
        customer_id: `CUST-EXP-${1000 + i}`,
        monthly_charges: (parseFloat(r.monthly_charges || '70') * 1.4).toFixed(2),
        contract_type: i % 2 === 0 ? 'One year' : 'Two year',
        customer_review: 'Exceptional service and quick issue resolution by the support team.',
      }));
      setParsedRows(sample);
      setDatasetName('Q4 Enterprise Expansion Cohort (250 Customers)');
    }
  };

  const handleRunPredictions = async () => {
    if (parsedRows.length === 0) {
      setUploadError('Please select or upload a dataset before running inference.');
      return;
    }

    setIsProcessing(true);

    setProcessingStep('Ingesting and parsing records...');
    await new Promise((r) => setTimeout(r, 400));

    setProcessingStep('Executing Random Forest Churn Classifier...');
    await new Promise((r) => setTimeout(r, 600));

    setProcessingStep('Performing NLP Sentiment Analysis on customer feedback...');
    await new Promise((r) => setTimeout(r, 500));

    setProcessingStep('Formulating Prescriptive Retention Playbooks & ARR protection...');
    await new Promise((r) => setTimeout(r, 400));

    // Run batch inference
    const name = datasetName.trim() || `Customer Dataset (${parsedRows.length} Records)`;
    const newDataset = runBatchInferenceOnRows(parsedRows, name, 'custom_upload');

    // Add to global context & set active
    addDataset(newDataset);
    switchDataset(newDataset.id);

    setCompletedDatasetId(newDataset.id);
    setCompletedStats({
      total: newDataset.metrics.totalCustomers,
      churnRate: newDataset.metrics.churnRate,
      positiveSentiment: newDataset.metrics.positiveSentimentPercent,
      salvageableArr: newDataset.metrics.salvageableArr,
      avgSpend: newDataset.metrics.avgMonthlySpend,
    });

    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0d121c] border border-[#1f2a3f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#1c2638] flex items-center justify-between bg-[#111726]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-950/50">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add Dataset &amp; Predict Intelligence
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Batch ML Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingest customer records to predict Churn, Sentiment, and Retention ROI in Power BI.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* If predictions completed, show Success & Switch Screen */}
          {completedStats ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  Inference Complete &amp; Dataset Loaded!
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  All {completedStats.total} customer records have been classified. Results are now active across CEIP and ready in Power BI.
                </p>
              </div>

              {/* 4 Outcome Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                  <span className="text-[11px] text-slate-400 block">Total Customers</span>
                  <span className="text-base font-bold text-white">{completedStats.total}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                  <span className="text-[11px] text-slate-400 block">Predicted Churn</span>
                  <span className="text-base font-bold text-rose-400">{completedStats.churnRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                  <span className="text-[11px] text-slate-400 block">Positive Sentiment</span>
                  <span className="text-base font-bold text-teal-400">{completedStats.positiveSentiment}%</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
                  <span className="text-[11px] text-slate-400 block">Salvageable ARR</span>
                  <span className="text-base font-bold text-emerald-400">${completedStats.salvageableArr.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleClose();
                    navigate('/power-bi');
                  }}
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View in Power BI Dashboard
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    handleClose();
                    navigate('/datasets');
                  }}
                  className="w-full sm:w-auto"
                >
                  Explore in Dataset Studio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing Animation Screen */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Running Multi-Model Inference Pipeline...
                </h4>
                <p className="text-xs text-indigo-400 font-mono mt-1 animate-pulse">
                  {processingStep}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Churn Model
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                  Sentiment NLP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Retention Playbooks
                </span>
              </div>
            </div>
          ) : (
            /* Standard Upload / Input Form */
            <>
              {/* Tab Selector */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-[#111726] border border-[#1f2a3f] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveInputTab('presets')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeInputTab === 'presets'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Project Presets (Instant)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputTab('upload')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeInputTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload CSV / JSON File</span>
                </button>
              </div>

              {/* Tab 1: One-Click Presets */}
              {activeInputTab === 'presets' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-medium">
                    Choose a pre-configured customer evaluation cohort:
                  </span>

                  {/* Preset 1: BCA Project Unseen Dataset */}
                  <div
                    onClick={() => handleSelectPreset('bca_unseen')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      datasetName.includes('Unseen BCA')
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-sm'
                        : 'bg-[#111726] border-[#1f2a3f] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white">
                            Unseen BCA Validation Cohort
                          </h5>
                          <Badge variant="info" size="sm">
                            500 Customers
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Source: <code>2_unseen_customers_no_churn_column.csv</code>. Ready for zero-shot churn and review sentiment scoring.
                        </p>
                      </div>
                    </div>
                    {datasetName.includes('Unseen BCA') && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>

                  {/* Preset 2: Enterprise Expansion Cohort */}
                  <div
                    onClick={() => handleSelectPreset('expansion')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      datasetName.includes('Expansion')
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-sm'
                        : 'bg-[#111726] border-[#1f2a3f] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white">
                            Q4 Enterprise Expansion Cohort
                          </h5>
                          <Badge variant="positive" size="sm">
                            250 Accounts
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          High monthly spend cohort with multi-year contract renewals and enterprise support tickets.
                        </p>
                      </div>
                    </div>
                    {datasetName.includes('Expansion') && (
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: File Upload (CSV / JSON) */}
              {activeInputTab === 'upload' && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#1f2a3f] hover:border-indigo-500/50 rounded-xl p-8 text-center cursor-pointer bg-[#111726]/50 transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.json"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Click to upload customer dataset file
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Supports .csv or .json with columns: customer_id, monthly_charges, contract_type, customer_review...
                    </span>
                  </div>
                </div>
              )}

              {/* Dataset Name Input & Preview Info */}
              {parsedRows.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1f2a3f] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Dataset Name:</span>
                    <span className="text-indigo-400 font-mono font-medium">
                      {parsedRows.length} rows loaded
                    </span>
                  </div>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="Enter a descriptive dataset name..."
                    className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              )}

              {/* Error Callout */}
              {uploadError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#1c2638] flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Outputs will be accessible across Power BI and Predictions.
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={parsedRows.length === 0 || isProcessing}
                    onClick={handleRunPredictions}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Predict &amp; Monetize ({parsedRows.length} Records)
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
