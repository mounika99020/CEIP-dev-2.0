import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors',
            'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50',
            'disabled:bg-slate-900/50 disabled:cursor-not-allowed disabled:text-slate-500',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/40',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-[11px] text-slate-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-[11px] text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';