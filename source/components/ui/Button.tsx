import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-950/40 border border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/40',
    secondary:
      'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-medium border border-slate-700/80 focus:ring-2 focus:ring-slate-600',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 font-medium border border-slate-700/80 hover:text-white focus:ring-2 focus:ring-slate-700',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-medium border border-transparent focus:ring-2 focus:ring-slate-700',
    danger:
      'bg-rose-600/90 hover:bg-rose-500 text-white font-medium border border-rose-500/50 focus:ring-2 focus:ring-rose-500/40',
    teal:
      'bg-teal-600 hover:bg-teal-500 text-white font-medium shadow-md shadow-teal-950/40 border border-teal-500/40 focus:ring-2 focus:ring-teal-500/40',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none select-none active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};