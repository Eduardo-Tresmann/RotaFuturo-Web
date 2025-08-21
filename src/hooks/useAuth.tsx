'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/AuthService';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { Usuario, LoginRequest, UsuarioCriacaoDTO } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  authResolved: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  registrar: (dadosUsuario: UsuarioCriacaoDTO) => Promise<void>;
  logout: () => void;
  recarregarUsuario: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [usuario, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [authResolved, setAuthResolved] = useState(false);

  const carregarUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (token && authService.isAuthenticated()) {
        const currentUser = await usuarioService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
        authService.logout();
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
      authService.logout();
    } finally {
      setLoading(false);
      setAuthResolved(true);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
  }, [carregarUsuario]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      try {
        await authService.login(credentials.usuEmail, credentials.usuSenha);
        await carregarUsuario();
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro no login:', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [carregarUsuario]
  );

  const registrar = useCallback(
    async (dadosUsuario: UsuarioCriacaoDTO) => {
      setLoading(true);
      try {
        await authService.registrar(
          dadosUsuario.usuEmail,
          dadosUsuario.usuSenha
        );
        await login(dadosUsuario);
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro no registro:', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);

    router.replace('/');
  }, [router]);

  const recarregarUsuario = useCallback(async () => {
    await carregarUsuario();
  }, [carregarUsuario]);

  return {
    usuario,
    isAuthenticated: !!usuario,
    loading,
    authResolved,
    login,
    registrar,
    logout,
    recarregarUsuario,
  };
};
