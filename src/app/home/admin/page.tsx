'use client';
import React, { useState } from 'react';

import {
  Users,
  Layers,
  Grid,
  BookOpen,
  GraduationCap,
  ListChecks,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { AdminModalView } from '@/app/home/admin/components/AdminModalView';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { UsuariosAdminContent } from './components/UsuariosAdminContent';
import { QuestionariosAdminContent } from './components/QuestionariosAdminContent';
import { CursosMateriasAdminContent } from './components/CursosMateriasAdminContent';
import { AreasAdminContent } from './components/AreasAdminContent';
import { AreaSubAdminContent } from './components/AreaSubAdminContent';
import { AdminSidebar, adminLinks } from './components/AdminSidebar';
import { HeaderHome } from '@/components/HeaderHome';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useAuthContext } from '@/components/context/AuthContext';

const moduloComponents: Record<string, React.ComponentType> = {
  usuarios: UsuariosAdminContent,
  questionarios: QuestionariosAdminContent,
  cursos: CursosMateriasAdminContent,
  areas: AreasAdminContent,
  areasub: AreaSubAdminContent,
};

export default function AdminHome() {
  const { authResolved } = useAuthContext();
  const [moduloSelecionado, setModuloSelecionado] = useState<keyof typeof moduloComponents | ''>(
    'questoes',
  );

  if (!authResolved) return <div>Carregando...</div>;

  function renderModulo() {
    if (moduloSelecionado && moduloComponents[moduloSelecionado]) {
      const Component = moduloComponents[moduloSelecionado];
      return <Component />;
    }
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 font-montserrat">
        <HeaderHome
          extra={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/home">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Administração</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
        <div className="flex flex-1 flex-row gap-8 w-full">
          <AdminSidebar current={moduloSelecionado} onSelect={setModuloSelecionado} />
          <div className="flex-1 flex flex-col gap-4 w-full py-6 px-4">
            <div className="flex flex-col items-center ">
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-700" />
                <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">
                  Administração
                </h1>
              </div>
            </div>
            <div className="w-full max-w-screen-2xl mx-auto">{renderModulo()}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
