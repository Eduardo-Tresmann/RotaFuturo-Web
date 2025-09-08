import React from 'react';
import { Users, FileText, BookOpen, Layers, ListChecks, UserCog } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';

export const adminLinks = [
  { key: 'areas', label: 'Áreas', icon: <UserCog className="w-5 h-5" /> },
  { key: 'cursos', label: 'Cursos', icon: <ListChecks className="w-5 h-5" /> },
  { key: 'questionarios', label: 'Questionários', icon: <BookOpen className="w-5 h-5" /> },
  { key: 'usuarios', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
];

export function AdminSidebar({ current, onSelect }: { current?: string, onSelect?: (key: string) => void }) {
  return (
    <Sidebar>
      
      <nav className="flex flex-col gap-1">
        {adminLinks.map(link => (
          <SidebarItem
            key={link.key}
            active={current === link.key}
            icon={link.icon}
            onClick={() => onSelect && onSelect(link.key)}
          >
            {link.label}
          </SidebarItem>
        ))}
      </nav>
    </Sidebar>
  );
}
