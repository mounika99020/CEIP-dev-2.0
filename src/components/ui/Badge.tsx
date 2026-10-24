import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'low' | 'medium' | 'high' | 'positive' | 'neutral' | 'negative' | 'default' | 'outline' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variantStyles = {
    low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    high: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    positive: 'bg-teal-500/10 text-teal-300 border border-teal-500/25',
    neutral: 'bg-slate-500/10 text-slate-300 border border-slate-500/25',
    negative: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    info: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25',
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};