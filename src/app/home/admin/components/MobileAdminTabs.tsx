import React from 'react';
import { cn } from '@/lib/utils';
import { adminLinks } from './AdminSidebar';

interface MobileAdminTabsProps {
  current?: string;
  onSelect?: (key: string) => void;
}

export function MobileAdminTabs({ current, onSelect }: MobileAdminTabsProps) {
  return (
    <div className="md:hidden w-full overflow-x-auto pb-2 px-2 sticky top-12 bg-gray-50 dark:bg-neutral-950 z-10 pt-2 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex space-x-2 min-w-max pb-1">
        {adminLinks.map((link) => (
          <button
            key={link.key}
            onClick={() => onSelect && onSelect(link.key)}
            className={cn(
              'flex items-center justify-center gap-1 px-3 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors',
              current === link.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700',
            )}
          >
            <span className="mr-1">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
