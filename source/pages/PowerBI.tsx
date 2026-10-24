import React, { useState } from 'react';
import {
  BarChart3,
  ExternalLink,
  Maximize2,
  RefreshCw,
  Layers,
  Settings,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const PowerBI: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('executive');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  const reports = [
    {
      id: 'executive',
      name: 'Executive Customer Intelligence',
      workspace: 'CEIP Production Analytics',
      status: 'Active',
    },
    {
      id: 'churn-matrix',
      name: 'Churn Cohort & Survival Matrix',
      workspace: 'CEIP Model Telemetry',
      status: 'Active',
    },
    {
      id: 'retention-roi',
      name: 'Retention Intervention ROI',
      workspace: 'Customer Success Ops',
      status: 'Active',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1c2638] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Enterprise BI Integration
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Business Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore interactive customer intelligence dashboards and business insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (embedUrl) {
                window.open(embedUrl, '_blank');
              } else {
                alert('Power BI report link will open once integration URL is configured.');
              }
            }}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Open Power BI Dashboard
          </Button>
        </div>
      </div>

      {/* Report Selection Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111726] border border-[#1f2a3f]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium px-1">
            Reports:
          </span>
          {reports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                selectedReport === rep.id
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{rep.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Embed Configuration</span>
          </button>
        </div>
      </div>

      {/* Embed Config Drawer (Optional expandable for developers during integration) */}
      {showConfig && (
        <Card className="border-[#1c2638] bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Power BI Embedded Workspace Settings
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Microsoft Power BI REST API / Azure AD
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Report Embed URL
              </label>
              <input
                type="text"
                placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Workspace Tenant ID
              </label>
              <input
                type="text"
                disabled
                value="tenant-prod-ceip-89214"
                className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Authentication Mode
              </label>
              <input
                type="text"
                disabled
                value="Service Principal / User Owns Data"
                className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Main Professional Embedded Dashboard Container */}
      <Card className="relative border-[#1c2638] bg-[#0d121c] min-h-[580px] flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Top Header of Container */}
        <div className="px-5 py-3.5 bg-[#111726] border-b border-[#1f2a3f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Power BI Dashboard
              </h3>
              <p className="text-[11px] text-slate-400">
                Workspace: {reports.find((r) => r.id === selectedReport)?.workspace}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge size="sm" variant="info">
              Interactive Viewport
            </Badge>
          </div>
        </div>

        {/* Interior Container Display Placeholder */}
        {embedUrl ? (
          <div className="flex-1 w-full h-full min-h-[500px]">
            <iframe
              src={embedUrl}
              title="Power BI Embedded Dashboard"
              className="w-full h-full min-h-[500px] border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-12">
            <div className="w-16 h-16 rounded-2xl bg-[#141b2a] border border-[#24314c] flex items-center justify-center text-indigo-400 shadow-xl mb-4">
              <BarChart3 className="w-8 h-8 text-indigo-400" />
            </div>

            <h4 className="text-base font-semibold text-slate-100 tracking-tight">
              Power BI Dashboard
            </h4>

            {/* STRICT REQUIREMENT: Exact text */}
            <p className="text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
              Power BI report will be connected during system integration.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  alert(
                    'Power BI embedded SDK connector is prepared. The report will load directly into this container upon providing the Azure Power BI embed token.'
                  );
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Power BI Dashboard
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4" />
              <span>
                Engineered for seamless Microsoft Power BI Embedded SDK drop-in.
              </span>
            </div>
          </div>
        )}

        {/* Footer Telemetry */}
        <div className="px-5 py-3 bg-[#090d15] border-t border-[#1a2336] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span>Protocol: HTTPS Direct Embed</span>
            <span>•</span>
            <span>Data Refresh: Real-time Telemetry Gateway</span>
          </div>
          <span className="font-mono">Container ID: pbi-embed-ceip-01</span>
        </div>
      </Card>
    </PageContainer>
  );
};