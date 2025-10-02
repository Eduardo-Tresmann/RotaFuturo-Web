'use client';
import { Header, HeaderProps } from '@/components/Header';
import { useAuthContext } from '@/components/context/AuthContext';
import { usePessoa } from '@/hooks/usePessoa';
import { Building2, LogOut, Menu, Settings, User, X } from 'lucide-react';

// Declaração de tipo para process.env
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};
import { getFileName } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
interface HeaderHomeProps extends Partial<HeaderProps> {
  customNavItems?: Array<{ href: string; label: string }>;
  customExtra?: React.ReactNode;
  hideDefaultNav?: boolean;
}
export function HeaderHome({
  customNavItems,
  customExtra,
  hideDefaultNav = false,
  ...props
}: HeaderHomeProps) {
  const { usuario, logout } = useAuthContext();
  const { pessoa } = usePessoa();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const defaultNavItems = [
    { href: '/home/dashboard', label: 'Dashboard' },
    { href: '/home/desafios', label: 'Desafios' },
  ];
  const navItems = hideDefaultNav
    ? customNavItems
    : [...defaultNavItems, ...(customNavItems || [])];
  const usuarioProfileData = {
    name:
      pessoa && pessoa.pesApelido && pessoa.pesApelido.trim() !== ''
        ? pessoa.pesApelido
        : usuario?.usuEmail || 'Usuário',
    email: usuario?.usuEmail || '',
    avatarUrl:
      pessoa && pessoa.pesImagemperfil && pessoa.pesImagemperfil.startsWith('storage/')
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
            pessoa.pesImagemperfil,
          )}`
        : 'https://via.placeholder.com/40',
  };
  const profileMenuItems = [
    {
      label: 'Administração',
      href: '/home/admin',
      icon: <Building2 className="mr-2 h-4 w-4 " />,
    },
    { isSeparator: true },
    {
      label: 'Configurações',
      href: '/home/configuracoes',
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      label: 'Meu Perfil',
      href: '/home/perfil',
      icon: <User className="mr-2 h-4 w-4" />,
    },
    { isSeparator: true },
    {
      label: 'Sair',
      onClick: logout,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ];
  const [headerTransparent, setHeaderTransparent] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      setHeaderTransparent(window.scrollY < 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      {}
      <div className="hidden md:block">
        <Header
          exibirBarraPesquisa={true}
          navItems={navItems}
          exibirNavbar={true}
          exibirPerfil={true}
          perfilUsuario={usuarioProfileData}
          profileMenuItems={profileMenuItems}
          menuItemClassName="text-zinc-200 hover:text-zinc-300"
          className={`sticky top-0 left-0 w-full z-50 transition-colors duration-300 ${
            headerTransparent
              ? 'bg-zinc-900/95 backdrop-blur shadow'
              : 'bg-zinc-900/80 backdrop-blur shadow'
          }`}
          extra={customExtra}
          {...props}
        />
      </div>
      {}
      <header className="md:hidden sticky top-0 left-0 w-full z-50 bg-zinc-900/95 backdrop-blur shadow border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Link href={pessoa?.pesNome ? '/home' : '/'}>
              <img src="/imagens/rf.svg" alt="rf logo" className="h-8 w-auto drop-shadow-md" />
            </Link>
            {customExtra && <div className="ml-3 max-w-[180px] overflow-hidden">{customExtra}</div>}
          </div>
          <div className="flex items-center space-x-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-zinc-900/95 backdrop-blur text-zinc-100 border-zinc-800 w-[80vw] sm:w-[350px]"
              >
                <SheetHeader className="pb-4 border-b border-zinc-800">
                  <SheetTitle className="text-zinc-100 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <img
                          src={usuarioProfileData.avatarUrl}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full border-2 border-zinc-700"
                        />
                        <div>
                          <div className="font-bold">{usuarioProfileData.name}</div>
                          {usuarioProfileData.email && (
                            <div className="text-xs text-zinc-400">{usuarioProfileData.email}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-1">
                  <h3 className="px-4 py-2 text-sm font-semibold text-zinc-400">Navegação</h3>
                  {navItems?.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-4 py-3 text-zinc-100 hover:bg-zinc-800 rounded-md flex items-center"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="h-px bg-zinc-800 my-4" />
                  <h3 className="px-4 py-2 text-sm font-semibold text-zinc-400">Sua Conta</h3>
                  {profileMenuItems.map((item, index) => {
                    if (item.isSeparator) {
                      return <div key={`sep-${index}`} className="h-px bg-zinc-800 my-2" />;
                    }
                    if (item.href) {
                      return (
                        <Link
                          key={`item-${index}`}
                          href={item.href}
                          className="px-4 py-3 text-zinc-100 hover:bg-zinc-800 rounded-md flex items-center"
                        >
                          {item.icon} <span className="ml-2">{item.label}</span>
                        </Link>
                      );
                    }
                    return (
                      <button
                        key={`btn-${index}`}
                        onClick={item.onClick}
                        className="px-4 py-3 text-zinc-100 hover:bg-zinc-800 rounded-md flex items-center w-full text-left"
                      >
                        {item.icon} <span className="ml-2">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
            <img
              src={usuarioProfileData.avatarUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-zinc-700"
            />
          </div>
        </div>
      </header>
    </>
  );
}
