import React from 'react';
import { adminStyles } from '@/app/home/admin/utils/responsive-styles';

interface AdminPageContentProps {
  title?: string;
  actionButtons?: React.ReactNode;
  tabs?: Array<{ label: string; value: string }>;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  filterButton?: React.ReactNode;
  filterModal?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  topGap?: string;
}

export const AdminPageContent: React.FC<AdminPageContentProps> = ({
  title,
  actionButtons,
  tabs,
  currentTab,
  onTabChange,
  filterButton,
  filterModal,
  children,
  className = '',
  topGap = 'gap-6',
}) => {
  return (
    <div className={`flex flex-col ${topGap} w-full font-montserrat ${className}`}>
      {/* Botões de ação */}
      {actionButtons && <div className={adminStyles.actionsContainer}>{actionButtons}</div>}
      {/* Abas e filtro */}
      {(tabs || filterButton) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-0 w-full gap-3 sm:gap-0">
          {tabs && (
            <div className="flex gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded-t-md font-semibold border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap
                    ${
                      currentTab === tab.value
                        ? 'border-blue-600 text-blue-700 bg-white dark:bg-neutral-900 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 bg-zinc-100 dark:bg-neutral-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-neutral-700'
                    }`}
                  onClick={() => onTabChange && onTabChange(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          {filterButton && (
            <div className="relative flex items-center w-full sm:w-auto mt-2 sm:mt-0">
              {filterButton}
            </div>
          )}
        </div>
      )}
      {(tabs || filterButton) && (
        <div className="w-full border-b border-zinc-200 dark:border-neutral-700" />
      )}
      {filterModal}
      <div className={`relative w-full shadow-lg rounded ${adminStyles.tableContainer}`}>
        <div className="min-w-full bg-white dark:bg-neutral-900 p-2 sm:p-4 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};
