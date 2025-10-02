'use client';
import React, { useState } from 'react';
import { LoaderRF } from '@/components/ui/LoaderRF';
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
import AdminRoute from '@/components/context/AdminRoute';
import { UsuariosAdminContent } from './components/UsuariosAdminContent';
import { QuestionariosAdminContent } from './components/QuestionariosAdminContent';
import { CursosMateriasAdminContent } from './components/CursosMateriasAdminContent';
import { AreasAdminContent } from './components/AreasAdminContent';
import { AreaSubAdminContent } from './components/AreaSubAdminContent';
import { AdminSidebar, adminLinks } from './components/AdminSidebar';
import { MobileAdminTabs } from './components/MobileAdminTabs';
import { TestesAdminContent } from './components/TestesAdminContent';
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
import { useTheme } from '@/components/context/ThemeContext'; 
import { GrupoAcessoAdminContent } from './components/GrupoAcessoAdminContent';
const moduloComponents: Record<string, React.ComponentType> = {
  usuarios: UsuariosAdminContent,
  questionarios: QuestionariosAdminContent,
  cursos: CursosMateriasAdminContent,
  areas: AreasAdminContent,
  areasub: AreaSubAdminContent,
  testes: TestesAdminContent,
  grupoacesso: GrupoAcessoAdminContent,
};
export default function AdminHome() {
  const { authResolved } = useAuthContext();
  const { theme } = useTheme(); 
  const [moduloSelecionado, setModuloSelecionado] = useState<keyof typeof moduloComponents | ''>(
    'questoes',
  );
  function renderModulo() {
    if (moduloSelecionado && moduloComponents[moduloSelecionado]) {
      const Component = moduloComponents[moduloSelecionado];
      return <Component />;
    }
    return null;
  }
  return (
    <>
      <AdminRoute>
        <div
          className={`flex flex-col min-h-screen font-montserrat bg-gradient-to-br from-zinc-50 to-blue-50
            ${theme === 'dark' ? 'dark bg-gradient-to-br from-zinc-900 to-zinc-800' : ''}
          `}
        >
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
          <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-8 w-full">
            <AdminSidebar current={moduloSelecionado} onSelect={setModuloSelecionado} />
            <div className="flex-1 flex flex-col gap-4 w-full py-4 md:py-6 px-2 md:px-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-700 dark:text-zinc-300" />
                  <h1 className="text-xl md:text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
                    Administração
                  </h1>
                </div>
                <MobileAdminTabs current={moduloSelecionado} onSelect={setModuloSelecionado} />
              </div>
              <div className="w-full max-w-screen-2xl mx-auto">{renderModulo()}</div>
            </div>
          </div>
        </div>
      </AdminRoute>
    </>
  );
}
