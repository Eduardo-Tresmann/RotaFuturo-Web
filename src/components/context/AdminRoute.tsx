'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
interface AdminRouteProps {
  children: React.ReactNode;
}
export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading, authResolved } = useAuth();
  useEffect(() => {
    if (authResolved) {
      if (!isAuthenticated) {
        router.replace('/auth');
      } else if (!isAdmin) {
        router.replace('/home');
      }
    }
  }, [isAuthenticated, isAdmin, authResolved, router]);
  if (loading || !authResolved) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        Acesso negado. Redirecionando...
      </div>
    );
  }
  return <>{children}</>;
}
