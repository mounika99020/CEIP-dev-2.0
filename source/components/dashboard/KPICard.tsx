import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'indigo' | 'teal' | 'amber' | 'rose';
  helperText?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  period = 'vs previous period',
  icon: Icon,
  accent = 'indigo',
  helperText,
}) => {
  const isPositiveChange = change !== undefined ? change >= 0 : true;

  const accentStyles = {
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      borderGlow: 'hover:border-indigo-500/40',
    },
    teal: {
      iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      borderGlow: 'hover:border-teal-500/40',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderGlow: 'hover:border-amber-500/40',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderGlow: 'hover:border-rose-500/40',
    },
  };

  return (
    <Card
      hover
      className={cn(
        'relative overflow-hidden transition-all duration-200 border-[#1c2638] bg-[#111726]/80',
        accentStyles[accent].borderGlow
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            {value}
          </div>
        </div>
        <div
          className={cn(
            'p-2.5 rounded-xl border flex items-center justify-center',
            accentStyles[accent].iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center font-medium px-1.5 py-0.5 rounded text-[11px]',
              isPositiveChange
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-rose-400 bg-rose-500/10'
            )}
          >
            {isPositiveChange ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(change)}%
          </span>
        )}
        <span className="text-slate-500 truncate">{helperText || period}</span>
      </div>
    </Card>
  );
};