import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200',
        hoverable && 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
