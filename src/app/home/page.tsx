'use client';

import { HeaderHome } from '@/components/HeaderHome';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useAuthContext } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaginaHome() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ProtectedRoute>
        <HeaderHome
          extra={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center text-xl font-semibold text-zinc-900">
              Página home, em desenvolvimento
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
