'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface Usuario {
  usuId: number;
  usuEmail: string;
  usuDataCadastro: string;
  usuHoraCadastro: string;
  usuEmailValidado: boolean;
  usuAtivo: boolean;
  usuTrocaSenha: boolean;
}

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const fetchCurrentUser = async (): Promise<Usuario | null> => {
    try {
      return await apiService.getCurrentUser();
    } catch {
      apiService.clearToken();
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      const token = apiService.getToken();
      if (token) {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch {
      apiService.clearToken();
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const token = await apiService.login(email, password);
      apiService.setToken(token);

      const currentUser = await fetchCurrentUser();
      if (!currentUser) throw new Error('Falha ao obter usuário');

      setUser(currentUser);
      router.push('/dashboard');
    } catch (error) {
      apiService.clearToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiService.register(email, password);
      await login(email, password);
    } catch (error) {
      apiService.clearToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>AQUI VOU POR UM LOADER DEPOIS...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
