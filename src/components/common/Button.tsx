import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
    icon: 'p-2 text-sm',
  };

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white shadow-sm hover:shadow focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-offset-slate-900',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-400 dark:focus:ring-offset-slate-900',
    outline:
      'border border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-400 dark:focus:ring-offset-slate-900',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 focus:ring-slate-400',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-sm focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-offset-slate-900',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm focus:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus:ring-offset-slate-900',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
