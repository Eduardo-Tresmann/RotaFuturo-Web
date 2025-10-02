'use client';
import Link from 'next/link';
import * as React from 'react';
import '@/styles/globals.css';
import Imagem from '@/components/Imagem';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface NavItem {
  href: string;
  label: string;
}
interface NavbarProps {
  items: NavItem[];
}
interface DropdownMenuItemType {
  label?: string;
  onClick?: () => void;
  href?: string;
  isSeparator?: boolean;
  isLabel?: boolean;
  icon?: React.ReactNode;
}
interface DadosPerfilUsuario {
  name: string;
  avatarUrl?: string;
  email?: string;
}
export interface HeaderProps {
  className?: string;
  exibirNavbar?: boolean;
  navItems?: NavItem[];
  menuItemClassName?: string;
  exibirBarraPesquisa?: boolean;
  exibirPerfil?: boolean;
  perfilUsuario?: DadosPerfilUsuario;
  profileMenuItems?: DropdownMenuItemType[];
  extra?: React.ReactNode;
}
export function Navbar({ items }: NavbarProps) {
  return (
    <nav className="hidden md:flex flex-grow justify-center">
      <ul className="flex space-x-6">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-zinc-800 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold px-2 py-1 rounded"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
function BarraPesquisa() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="py-1 px-3 pl-8 rounded-full bg-zinc-800 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700 transition-colors"
      />
      <svg
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
}
interface PerfilDropdownProps extends DadosPerfilUsuario {
  menuItems: DropdownMenuItemType[];
}
function PerfilDropdown({ name, email, avatarUrl, menuItems }: PerfilDropdownProps) {
  const defaultAvatar = 'https://via.placeholder.com/40';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none cursor-pointer text-zinc-100 group">
          <img
            src={avatarUrl || defaultAvatar}
            alt="Avatar do Usuário"
            className="w-9 h-9 rounded-full border-2 border-zinc-600 group-hover:border-blue-500 transition-all duration-200 shadow-md"
          />
          <span className="hidden md:inline text-base font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
            {name || email || 'Usuário'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 max-w-[90vw] bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 text-zinc-100 shadow-2xl rounded-xl p-0 overflow-hidden animate-fade-in"
        align="end"
        side="bottom"
        sideOffset={20}
        forceMount
      >
        <div className="flex flex-col items-center py-3 px-3 bg-zinc-900/80">
          <p className="text-base font-bold text-zinc-100 text-center break-words max-w-full">
            {name || 'Usuário'}
          </p>
          {email && (
            <p className="text-xs text-zinc-400 text-center break-words max-w-full">{email}</p>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <div className="py-1">
          {menuItems.map((item, index) => {
            if (item.isSeparator) {
              return <DropdownMenuSeparator key={`separator-${index}`} />;
            }
            if (item.isLabel) {
              return <DropdownMenuLabel key={`label-${index}`}>{item.label}</DropdownMenuLabel>;
            }
            return (
              <DropdownMenuItem
                key={item.href || item.label}
                onClick={item.onClick}
                className="px-4 py-2 text-zinc-100 flex items-center gap-3 hover:text-zinc-100 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 focus:bg-zinc-800/90 transition-colors cursor-pointer rounded-none"
              >
                {item.href ? (
                  <Link href={item.href} className="flex items-center gap-2 w-full h-full">
                    {item.icon} {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    {item.icon} {item.label}
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function Header({
  exibirNavbar = false,
  navItems = [],
  menuItemClassName = '',
  exibirBarraPesquisa = false,
  exibirPerfil = false,
  perfilUsuario,
  profileMenuItems = [],
  className,
  extra,
}: HeaderProps) {
  return (
    <header
      className={`w-full shadow-sm font-light transition-colors duration-300 ${
        className ?? ''
      } bg-zinc-900 text-zinc-100 border-b border-zinc-800`}
      style={{ backgroundColor: '#18181b', color: '#f4f4f5', borderBottom: '1px solid #27272a' }}
    >
      <div className="w-full px-3 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 relative">
          <Link
            href={perfilUsuario && perfilUsuario.name !== 'Usuário' ? '/home' : '/'}
            className="flex items-center"
          >
            <Imagem
              src="/imagens/rf.svg"
              alt="rf logo"
              width={48}
              height={48}
              className="h-10 w-auto drop-shadow-md"
            />
          </Link>
          {extra && <div className="ml-4">{extra}</div>}
        </div>
        {exibirNavbar && (
          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex space-x-0">
              {navItems?.map((item, idx) => (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className={`px-4 py-1 transition-colors text-base font-semibold rounded ${menuItemClassName} text-zinc-100 hover:bg-zinc-800`}
                  >
                    {item.label}
                  </Link>
                  {idx < navItems.length - 1 && (
                    <span className="h-6 w-px bg-zinc-700 mx-2 opacity-70" />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="flex items-center space-x-4">
          {exibirBarraPesquisa && <BarraPesquisa />}
          <ThemeSwitch />
          {exibirPerfil && perfilUsuario && (
            <PerfilDropdown
              name={perfilUsuario.name || 'Usuário'}
              email={perfilUsuario.email || ''}
              avatarUrl={perfilUsuario.avatarUrl || 'https://via.placeholder.com/40'}
              menuItems={profileMenuItems}
            />
          )}
        </div>
      </div>
    </header>
  );
}
