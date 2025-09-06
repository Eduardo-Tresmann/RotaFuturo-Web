// Backup do HeaderHome antes da inversão
import { Header, HeaderProps } from '@/components/Header';
import { useAuthContext } from '@/components/context/AuthContext';
import { usePessoa } from '@/hooks/usePessoa';
import { Building2, LogOut, Settings, User } from 'lucide-react';

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

  const defaultNavItems = [
    { href: '/home/dashboard', label: 'Dashboard' },
    { href: '/home/desafios', label: 'Desafios' },
  ];

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
