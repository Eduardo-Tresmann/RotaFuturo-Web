import React from 'react';

interface AdminModalViewProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const AdminModalView: React.FC<AdminModalViewProps> = ({
  open,
  onClose,
  children,
  title,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl h-[95vh] bg-white dark:bg-neutral-900 rounded-md shadow-2xl border border-zinc-200 dark:border-neutral-700 flex flex-col overflow-hidden animate-modalSlide p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 text-zinc-500 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        {title && (
          <div className="px-10 pt-10 pb-4 border-b border-zinc-100 dark:border-neutral-800">
            <h2 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 text-center tracking-tight drop-shadow-lg">
              {title}
            </h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-10 py-8">{children}</div>
      </div>
    </div>
  );
};
