'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading, authResolved } = useAuthContext();

  useEffect(() => {
    if (authResolved && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, authResolved, router]);

  if (loading || !authResolved) {
    return <div className="p-4">Carregando...</div>;
  }

  return <>{children}</>;
}
