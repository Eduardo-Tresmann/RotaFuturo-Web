import * as React from 'react';
import { cn } from '@/lib/utils';
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-64 min-h-screen border-r bg-[#f6f8fa] dark:bg-neutral-950 px-4 py-6 gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
export function SidebarItem({ active, icon, children, className, ...props }: SidebarItemProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800/70',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{icon}</span>
      )}
      <span className="text-left flex-1">{children}</span>
    </button>
  );
}
