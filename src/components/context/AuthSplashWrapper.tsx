// Wrapper para controlar o splashscreen com base no contexto de autenticação
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/context/AuthContext';
import { SplashScreen } from '@/components/SplashScreen';

interface AuthSplashWrapperProps {
  children: React.ReactNode;
  pathname: string;
}

export default function AuthSplashWrapper({ children, pathname }: AuthSplashWrapperProps) {
  const { authResolved } = useAuthContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (pathname === '/') {
      setShowSplash(false);
      return;
    }
    if (showSplash && authResolved) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSplash, pathname, authResolved]);

  if (showSplash) {
    return <SplashScreen />;
  }
  return <>{children}</>;
}
