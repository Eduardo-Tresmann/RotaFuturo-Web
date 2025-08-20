'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/AuthService';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { Usuario, LoginRequest, UsuarioCriacaoDTO } from '@/types';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  authResolved: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: UsuarioCriacaoDTO) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [authResolved, setAuthResolved] = useState(false);

  const loadUser = useCallback(async () => {
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
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      try {
        await authService.login(credentials.usuEmail, credentials.usuSenha);
        await loadUser();
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro no login:', error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadUser]
  );

  const register = useCallback(
    async (userData: UsuarioCriacaoDTO) => {
      setLoading(true);
      try {
        await authService.register(userData.usuEmail, userData.usuSenha);
        await login(userData);
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

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    authResolved,
    login,
    register,
    logout,
    refreshUser,
  };
};
