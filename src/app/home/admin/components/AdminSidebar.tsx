import React from 'react';
import { Users, FileText, BookOpen, Layers, ListChecks, UserCog } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { HelpCircle } from 'lucide-react';

export const adminLinks = [
  { key: 'areas', label: 'Áreas', icon: <UserCog className="w-5 h-5" /> },
  { key: 'cursos', label: 'Cursos', icon: <ListChecks className="w-5 h-5" /> },
  { key: 'questionarios', label: 'Questionários', icon: <BookOpen className="w-5 h-5" /> },
  { key: 'testes', label: 'Testes', icon: <HelpCircle className="w-5 h-5" /> },
  { key: 'usuarios', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
];

export function AdminSidebar({
  current,
  onSelect,
}: {
  current?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <Sidebar className="hidden md:block !h-screen !min-h-screen !w-72 !rounded-none !border-r !border-gray-200 dark:!border-neutral-700 !bg-white dark:!bg-neutral-950 shadow-md">
      <nav className="flex flex-col gap-1">
        {adminLinks.map((link) => (
          <SidebarItem
            key={link.key}
            active={current === link.key}
            icon={link.icon}
            onClick={() => onSelect && onSelect(link.key)}
            className={
              current === link.key
                ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold'
                : 'text-gray-700 dark:text-gray-300'
            }
          >
            {link.label}
          </SidebarItem>
        ))}
      </nav>
    </Sidebar>
  );
}
