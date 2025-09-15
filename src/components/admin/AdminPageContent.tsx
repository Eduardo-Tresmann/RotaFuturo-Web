import React from 'react';

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
      {actionButtons && (
        <div className="flex gap-2 mb-4">{actionButtons}</div>
      )}
      {/* Abas e filtro */}
      {(tabs || filterButton) && (
        <div className="flex items-end justify-between mb-0 w-full">
          {tabs && (
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors
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
            <div className="relative flex items-center">{filterButton}</div>
          )}
        </div>
      )}
      {(tabs || filterButton) && <div className="w-full border-b border-zinc-200 dark:border-neutral-700" />}
      {filterModal}
      <div className="relative w-full overflow-auto shadow-lg rounded">
        <div className="min-w-full">{children}</div>
      </div>
    </div>
  );
};
