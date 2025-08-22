'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthContext } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/context/ProtectedRoute';

export default function PaginaDashboard() {
  const { usuario, logout, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const headerNavItems = [
    { href: '/menu1', label: 'menu1' },
    { href: '/menu2', label: 'menu2' },
    { href: '/menu3', label: 'menu3' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const usuarioProfileData = {
    name: usuario?.usuEmail?.split('@')[0] || 'Usuário',
    email: usuario?.usuEmail,
  };

  const ProfileMenuItems = [
    { label: 'Minha Conta', isLabel: true },
    {
      label: 'Perfil',
      href: '/perfil',
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
    <>
      <ProtectedRoute>
        <Header
          exibirBarraPesquisa={true}
          navItems={headerNavItems}
          exibirNavbar={true}
          exibirPerfil={true}
          perfilUsuario={usuarioProfileData}
          profileMenuItems={ProfileMenuItems}
        />

        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900">
                      Dashboard
                    </h1>
                    <p className="text-zinc-600">
                      Bem-vindo de volta, {usuario?.usuEmail}!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Informações do Usuário
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      <strong>Email:</strong> {usuario?.usuEmail}
                    </p>
                    <p>
                      <strong>ID:</strong> {usuario?.usuId}
                    </p>
                    <p>
                      <strong>Data de Cadastro:</strong> {usuario?.usuDataCadastro}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      {usuario?.usuAtivo ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Status da Conta
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>
                      <strong>Email Validado:</strong>{' '}
                      {usuario?.usuEmailValidado ? 'Sim' : 'Não'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
