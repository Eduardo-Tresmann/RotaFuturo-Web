'use client';
import React, { useEffect, useState } from 'react';
import MateriaForm from '@/components/forms/MateriaForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { MateriaTable } from '@/components/tables/MateriaTable';
import { materiaService } from '@/services/materia/MateriaService';
import { Materia } from '@/types/materia';

export default function MateriasAdminPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  useEffect(() => {
    materiaService
      .listAll()
      .then(setMaterias)
      .catch(() => setMaterias([]));
  }, []);
  return (
    <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
      <div className="w-full max-w-md flex-shrink-0">
        <MateriaForm />
      </div>
      <div className="flex-1">
        <MateriaTable materias={materias} onEdit={() => {}} onInativar={() => {}} />
      </div>
    </div>
  );
}
