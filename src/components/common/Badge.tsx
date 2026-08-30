import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  size = 'md',
  icon,
  className,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const isHex = color && color.startsWith('#');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full shrink-0 select-none border',
        sizeStyles[size],
        !color && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        className
      )}
      style={
        isHex
          ? {
              backgroundColor: `${color}18`,
              borderColor: `${color}40`,
              color: color,
            }
          : undefined
      }
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
