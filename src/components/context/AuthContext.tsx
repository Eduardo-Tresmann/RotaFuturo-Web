'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Usuario, LoginRequest, UsuarioCriacaoDTO } from '@/types/usuario';
interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  authResolved: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  registrar: (usuarioData: UsuarioCriacaoDTO) => Promise<void>;
  logout: () => void;
  recarregarUsuario: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};
