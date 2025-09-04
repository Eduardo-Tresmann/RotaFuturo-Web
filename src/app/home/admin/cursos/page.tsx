'use client';
import React, { useEffect, useState } from 'react';
import CursoForm from '@/components/forms/CursoForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { CursoTable } from '@/components/tables/CursoTable';
import { cursoService } from '@/services/curso/CursoService';
import { Curso } from '@/types/curso';

export default function CursosAdminPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  useEffect(() => {
    cursoService
      .listAll()
      .then(setCursos)
      .catch(() => setCursos([]));
  }, []);
  return (
    <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
      <div className="w-full max-w-md flex-shrink-0">
        <CursoForm />
      </div>
      <div className="flex-1">
        <CursoTable cursos={cursos} onEdit={() => {}} onInativar={() => {}} />
      </div>
    </div>
  );
}
