'use client';

import { Header, HeaderProps } from '@/components/Header';
import { useAuthContext } from '@/components/context/AuthContext';
import { usePessoa } from '@/hooks/usePessoa';
import { LogOut, Settings, User } from 'lucide-react';

interface HeaderHomeProps extends Partial<HeaderProps> {
  // Props específicas que podem ser customizadas
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

  // Nav items padrão para páginas dentro de /home
  const defaultNavItems = [
    { href: '/home/dashboard', label: 'Dashboard' },
    { href: '/home/desafios', label: 'Desafios' },
  ];

  // Dados do perfil do usuário
  const usuarioProfileData = {
    name:
      pessoa?.pesApelido && pessoa?.pesApelido.trim() !== ''
        ? pessoa.pesApelido
        : usuario?.usuEmail || 'Usuário',
    email: usuario?.usuEmail,
    avatarUrl:
      pessoa?.pesImagemperfil && pessoa?.pesImagemperfil.trim() !== ''
        ? `${process.env.NEXT_PUBLIC_API_URL}${pessoa.pesImagemperfil}`
        : 'https://via.placeholder.com/48',
  };

  // Itens do menu de perfil
  const profileMenuItems = [
    { label: 'Minha Conta', isLabel: true },
    {
      label: 'Perfil',
      href: '/home/perfil',
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      label: 'Configurações',
      href: '/configuracoes',
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    { isSeparator: true },
    {
      label: 'Sair',
      onClick: logout,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <Header
      exibirBarraPesquisa={true}
      navItems={hideDefaultNav ? customNavItems : [...defaultNavItems, ...(customNavItems || [])]}
      exibirNavbar={true}
      exibirPerfil={true}
      perfilUsuario={usuarioProfileData}
      profileMenuItems={profileMenuItems}
      menuItemClassName="text-zinc-200 hover:text-zinc-300"
      className="bg-zinc-900/95 backdrop-blur shadow"
      extra={customExtra}
      {...props}
    />
  );
}
