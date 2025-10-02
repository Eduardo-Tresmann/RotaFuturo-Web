'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/AuthService';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { grupoAcessoUsuarioService } from '@/services/grupo/GrupoAcessoUsuarioService';
import { Usuario, LoginRequest, UsuarioCriacaoDTO } from '@/types/usuario';
interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  authResolved: boolean;
  gruposUsuario: string[];
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  registrar: (dadosUsuario: UsuarioCriacaoDTO) => Promise<void>;
  logout: () => void;
  recarregarUsuario: () => Promise<void>;
  verificarPermissao: (grupoNecessario: string) => boolean;
}
export const useAuth = (): AuthContextType => {
  const [usuario, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gruposUsuario, setGruposUsuario] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const [authResolved, setAuthResolved] = useState(false);
  const carregarUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const token = authService.getToken();
      if (token && authService.isAuthenticated()) {
        const currentUser = await usuarioService.getCurrentUser();
        setUser(currentUser);
        if (currentUser && currentUser.usuId) {
          const grupos = await grupoAcessoUsuarioService.listarGruposDoUsuario(currentUser.usuId);
          setGruposUsuario(grupos);
          setIsAdmin(grupos.indexOf('ADMINISTRADOR') !== -1);
        }
      } else {
        setUser(null);
        setGruposUsuario([]);
        setIsAdmin(false);
        authService.logout();
      }
    } catch (error) {
      setUser(null);
      setGruposUsuario([]);
      setIsAdmin(false);
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
        const checkAuth = async (retries = 10) => {
          for (let i = 0; i < retries; i++) {
            const token = authService.getToken();
            if (token) {
              return true;
            }
            await new Promise((res) => setTimeout(res, 100));
          }
          return false;
        };
        const isAuth = await checkAuth();
        if (isAuth) {
          router.push('/home');
        }
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [carregarUsuario],
  );
  const registrar = useCallback(
    async (dadosUsuario: UsuarioCriacaoDTO) => {
      setLoading(true);
      try {
        await authService.registrar(dadosUsuario.usuEmail, dadosUsuario.usuSenha);
        await login(dadosUsuario);
      } catch (error: any) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login],
  );
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setGruposUsuario([]);
    setIsAdmin(false);
    router.replace('/auth');
  }, [router]);
  const recarregarUsuario = useCallback(async () => {
    await carregarUsuario();
  }, [carregarUsuario]);
  const verificarPermissao = useCallback(
    (grupoNecessario: string): boolean => {
      return gruposUsuario.indexOf(grupoNecessario) !== -1;
    },
    [gruposUsuario],
  );
  return {
    usuario,
    isAuthenticated: !!usuario,
    loading,
    authResolved,
    gruposUsuario,
    isAdmin,
    login,
    registrar,
    logout,
    recarregarUsuario,
    verificarPermissao,
  };
};
