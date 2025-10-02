import { cn } from '@/lib/utils';
export const adminStyles = {
  tableContainer: 'w-full overflow-x-auto -webkit-overflow-scrolling-touch',
  table: 'min-w-[640px] w-full',
  formGrid: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  actionsContainer: 'flex flex-wrap gap-2 justify-end sm:justify-end mt-4 sm:mt-0',
  mobileButton: 'sm:px-4 px-3 py-2 text-sm sm:text-base flex-1 sm:flex-none',
  responsiveCard:
    'block p-4 rounded-md shadow-sm mb-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700',
  cardRowTitle: 'font-semibold text-gray-600 dark:text-gray-300 text-sm mb-1',
  cardRowContent: 'mb-2',
  mobileModal: 'p-3 sm:p-6',
  mobileModalTitle: 'text-xl sm:text-2xl',
  mobileModalForm: 'gap-3 sm:gap-6',
};
export function adminResponsive(
  baseStyles: string,
  componentType: keyof typeof adminStyles,
): string {
  return cn(baseStyles, adminStyles[componentType]);
}
