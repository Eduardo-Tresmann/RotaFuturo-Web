'use client';

import Link from 'next/link';
import * as React from 'react';
import '@/styles/globals.css'; 

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

interface UserProfileData {
  name: string;
  avatarUrl?: string;
  email?: string;
}

interface HeaderProps {
  className?: string;
  showNavbar?: boolean;
  navItems?: NavItem[];
  showSearchBar?: boolean;
  showProfileSection?: boolean;
  userProfile?: UserProfileData;
  profileMenuItems?: DropdownMenuItemType[];
}

export function Navbar({ items }: NavbarProps) {
  return (
    <nav className="hidden md:flex flex-grow justify-center">
      <ul className="flex space-x-6">
        {items.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-white hover:text-zinc-400 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="py-1 px-3 pl-8 rounded-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

interface ProfileDropdownProps extends UserProfileData {
  menuItems: DropdownMenuItemType[];
}

function ProfileDropdown({
  name,
  email,
  avatarUrl,
  menuItems,
}: ProfileDropdownProps) {
  const defaultAvatar = 'https://via.placeholder.com/32';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none cursor-pointer">
          <img
            src={avatarUrl || defaultAvatar}
            alt="Avatar do Usuário"
            className="w-8 h-8 rounded-full border-2 border-zinc-400"
          />
          <span className="hidden md:inline text-sm">{name || 'Usuário'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-50" align="end" side="bottom" sideOffset={20} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {name || 'Usuário'}
            </p>
            {email && (
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map((item, index) => {
          if (item.isSeparator) {
            return <DropdownMenuSeparator key={`separator-${index}`} />;
          }
          if (item.isLabel) {
            return (
              <DropdownMenuLabel key={`label-${index}`}>
                {item.label}
              </DropdownMenuLabel>
            );
          }
          return (
            <DropdownMenuItem
              key={item.href || item.label}
              onClick={item.onClick}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 w-full h-full"
                >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({
  showNavbar = false,
  navItems = [],
  showSearchBar = false,
  showProfileSection = false,
  userProfile,
  profileMenuItems = [],
}: HeaderProps) {
  return (
    <header className="bg-zinc-900 text-white w-full shadow-header">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
            ROTAFUTURO
          </span>
        </Link> 

        {showNavbar && <Navbar items={navItems} />}

        <div className="flex items-center space-x-4">
          {showSearchBar && <SearchBar />}

          {showProfileSection && userProfile && (
            <ProfileDropdown
              name={userProfile.name}
              email={userProfile.email}
              avatarUrl={userProfile.avatarUrl}
              menuItems={profileMenuItems}
            />
          )}
        </div>
      </div>
    </header>
  );
}
