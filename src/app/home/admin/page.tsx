'use client';
import React, { useState } from 'react';
import { Users, Layers, Grid, BookOpen, GraduationCap, ListChecks, HelpCircle } from 'lucide-react';
import { AdminModalView } from '@/components/ui/AdminModalView';
import { HeaderHome } from '@/components/HeaderHome';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import UsuariosPage from '@/app/home/admin/usuarios/page';
import AreasAdminPage from '@/app/home/admin/areas/page';
import AreaSubAdminPage from '@/app/home/admin/areasub/page';
import MateriasAdminPage from '@/app/home/admin/materias/page';
import CursosAdminPage from '@/app/home/admin/cursos/page';
import QuestionariosAdminPage from '@/app/home/admin/questionarios/page';
import QuestoesAdminPage from '@/app/home/admin/questoes/page';

const adminLinks = [
  { key: 'usuarios', label: 'Usuários', icon: <Users className="w-6 h-6 text-zinc-500" /> },
  { key: 'areas', label: 'Áreas', icon: <Layers className="w-6 h-6 text-zinc-500" /> },
  { key: 'areasub', label: 'Sub Áreas', icon: <Grid className="w-6 h-6 text-zinc-500" /> },
  { key: 'materias', label: 'Matérias', icon: <BookOpen className="w-6 h-6 text-zinc-500" /> },
  { key: 'cursos', label: 'Cursos', icon: <GraduationCap className="w-6 h-6 text-zinc-500" /> },
  {
    key: 'questionarios',
    label: 'Questionários',
    icon: <ListChecks className="w-6 h-6 text-zinc-500" />,
  },
  { key: 'questoes', label: 'Questões', icon: <HelpCircle className="w-6 h-6 text-zinc-500" /> },
];

const moduloComponents: Record<string, React.ComponentType> = {
  usuarios: UsuariosPage,
  areas: AreasAdminPage,
  areasub: AreaSubAdminPage,
  materias: MateriasAdminPage,
  cursos: CursosAdminPage,
  questionarios: QuestionariosAdminPage,
  questoes: QuestoesAdminPage,
};

export default function AdminHome() {
  const [moduloSelecionado, setModuloSelecionado] = useState<keyof typeof moduloComponents | ''>(
    '',
  );

  function renderModulo() {
    if (moduloSelecionado && moduloComponents[moduloSelecionado]) {
      const Component = moduloComponents[moduloSelecionado];
      return (
        <AdminModalView
          open={!!moduloSelecionado}
          onClose={() => setModuloSelecionado('')}
          title={adminLinks.find((l) => l.key === moduloSelecionado)?.label}
        >
          <Component />
        </AdminModalView>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {adminLinks.map((link) => (
          <button
            key={link.key}
            onClick={() => setModuloSelecionado(link.key)}
            className="flex flex-col items-center justify-center w-full max-w-xs mx-auto h-32 bg-white rounded-xl shadow-md border border-zinc-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group p-0"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-md bg-zinc-100 group-hover:bg-blue-100 border border-zinc-200 mb-2">
              {link.icon}
            </span>
            <span className="font-bold text-base text-zinc-700 group-hover:text-blue-700 transition-all mb-1">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <HeaderHome />
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 flex flex-col items-center justify-start py-10 overflow-hidden">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-zinc-100 p-10 flex flex-col gap-10 mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-700" />
              <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">
                Administração
              </h1>
            </div>
          </div>
          {renderModulo()}
        </div>
      </div>
    </ProtectedRoute>
  );
}
