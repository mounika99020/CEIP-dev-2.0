import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquareQuote,
  ShieldAlert,
  Target,
  Cpu,
  BarChart3,
  Bot,
  Layers,
  ChevronRight,
  X,
  Database,
  Plus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDataset } from '../../context/DatasetContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OVERVIEW_NAV: NavItem[] = [
  { name: 'Overview', path: '/overview', icon: LayoutDashboard },
  { name: 'Customer Experience', path: '/customer-experience', icon: Users },
];

const INTELLIGENCE_NAV: NavItem[] = [
  { name: 'Sentiment', path: '/sentiment', icon: MessageSquareQuote },
  { name: 'Churn', path: '/churn', icon: ShieldAlert },
  { name: 'Retention', path: '/retention', icon: Target },
  { name: 'Predictions', path: '/predictions', icon: Cpu },
  { name: 'Dataset Studio', path: '/datasets', icon: Database },
];

const INSIGHTS_NAV: NavItem[] = [
  { name: 'Power BI', path: '/power-bi', icon: BarChart3 },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeDataset, openAddModal } = useDataset();

  const renderNavLink = (item: NavItem) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose();
        }}
        className={({ isActive }) =>
          cn(
            'group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            isActive
              ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          )
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex items-center gap-3">
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              <span>{item.name}</span>
            </div>
            {isActive && (
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400/80" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Persistent / Responsive Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d121c] border-r border-[#1a2336] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#1a2336] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-teal-500 flex items-center justify-center shadow-md shadow-indigo-950/50">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">CEIP</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Customer Experience Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Overview */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Overview
            </div>
            <div className="space-y-1">
              {OVERVIEW_NAV.map(renderNavLink)}
            </div>
          </div>

          {/* Intelligence */}
          <div>
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Intelligence
              </span>
              <button
                type="button"
                onClick={() => {
                  openAddModal();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:bg-indigo-950/50 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                title="Add custom or unseen dataset"
              >
                <Plus className="w-3 h-3" />
                <span>Add Dataset</span>
              </button>
            </div>
            <div className="space-y-1">
              {INTELLIGENCE_NAV.map(renderNavLink)}
            </div>
          </div>

          {/* Insights */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Insights
            </div>
            <div className="space-y-1">
              {INSIGHTS_NAV.map(renderNavLink)}
            </div>
          </div>
        </div>

        {/* Bottom Status & User Profile */}
        <div className="p-3.5 border-t border-[#1a2336] bg-[#090d15]/80 space-y-3">
          {/* Active Dataset Chip */}
          <div className="p-2 rounded-lg bg-[#111726] border border-[#1f2a3f] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Active Dataset
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                {activeDataset.name}
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 shrink-0">
              {activeDataset.customerCount} rows
            </span>
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
            <span>System Operational</span>
          </div>

          {/* User Profile - STRICT REQUIREMENT: Only User / CX Analyst */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
              U
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-200 truncate">
                User
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                CX Analyst
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};