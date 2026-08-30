import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
