import { cn } from '@/lib/utils';

export const adminStyles = {
  // Container para tabelas responsivas
  tableContainer: 'w-full overflow-x-auto -webkit-overflow-scrolling-touch',

  // Tabela responsiva
  table: 'min-w-[640px] w-full',

  // Grid para formulários responsivos
  formGrid: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',

  // Container para ações/botões
  actionsContainer: 'flex flex-wrap gap-2 justify-end sm:justify-end mt-4 sm:mt-0',

  // Estilo para botões em mobile
  mobileButton: 'sm:px-4 px-3 py-2 text-sm sm:text-base flex-1 sm:flex-none',

  // Card responsivo (para mobile)
  responsiveCard:
    'block p-4 rounded-md shadow-sm mb-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700',

  // Título de linha na visualização de card
  cardRowTitle: 'font-semibold text-gray-600 dark:text-gray-300 text-sm mb-1',

  // Conteúdo de linha na visualização de card
  cardRowContent: 'mb-2',

  // Estilos para modais em telas pequenas
  mobileModal: 'p-3 sm:p-6',
  mobileModalTitle: 'text-xl sm:text-2xl',
  mobileModalForm: 'gap-3 sm:gap-6',
};

// Função auxiliar para combinar estilos
export function adminResponsive(
  baseStyles: string,
  componentType: keyof typeof adminStyles,
): string {
  return cn(baseStyles, adminStyles[componentType]);
}
