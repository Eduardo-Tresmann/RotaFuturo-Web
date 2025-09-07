import React, { useEffect, useState } from 'react';
import CursoForm from '@/app/home/admin/components/CursoForm';
import { CursoTable } from '@/app/home/admin/components/CursoTable';
import { cursoService } from '@/services/curso/CursoService';
import { Curso } from '@/types/curso';

export function CursosAdminContent() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  useEffect(() => {
    cursoService
      .listAll()
      .then(setCursos)
      .catch(() => setCursos([]));
  }, []);
  return (
    <div className="flex flex-col gap-10 w-full font-montserrat">
      <div className="w-full max-w-2xl mx-auto">
        <CursoForm />
      </div>
      <CursoTable cursos={cursos} onEdit={() => {}} onInativar={() => {}} />
    </div>
  );
}
