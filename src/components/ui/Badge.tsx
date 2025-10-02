import React from 'react';
import clsx from 'clsx';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'green' | 'red' | 'gray' | 'blue' | 'yellow';
  variant?: 'solid' | 'outline' | 'soft';
}
export function Badge({
  color = 'gray',
  variant = 'soft',
  className,
  children,
  ...props
}: BadgeProps) {
  const colorMap: Record<string, string> = {
    green: variant === 'solid'
      ? 'bg-green-600 text-white'
      : variant === 'outline'
      ? 'border border-green-600 text-green-700'
      : 'bg-green-100 text-green-700',
    red: variant === 'solid'
      ? 'bg-red-600 text-white'
      : variant === 'outline'
      ? 'border border-red-600 text-red-700'
      : 'bg-red-100 text-red-700',
    gray: variant === 'solid'
      ? 'bg-zinc-700 text-white'
      : variant === 'outline'
      ? 'border border-zinc-400 text-zinc-700'
      : 'bg-zinc-200 text-zinc-700',
    blue: variant === 'solid'
      ? 'bg-blue-600 text-white'
      : variant === 'outline'
      ? 'border border-blue-600 text-blue-700'
      : 'bg-blue-100 text-blue-700',
    yellow: variant === 'solid'
      ? 'bg-yellow-400 text-zinc-900'
      : variant === 'outline'
      ? 'border border-yellow-400 text-yellow-700'
      : 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs uppercase shadow-sm transition-all',
        colorMap[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
