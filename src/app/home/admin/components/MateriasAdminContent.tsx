import React, { useEffect, useState } from 'react';
import MateriaForm from '@/app/home/admin/components/MateriaForm';
import { MateriaTable } from '@/app/home/admin/components/MateriaTable';
import { materiaService } from '@/services/materia/MateriaService';
import { Materia } from '@/types/materia';

export function MateriasAdminContent() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  useEffect(() => {
    materiaService
      .listAll()
      .then(setMaterias)
      .catch(() => setMaterias([]));
  }, []);
  return (
    <div className="flex flex-col gap-10 w-full font-montserrat">
      <div className="w-full max-w-2xl mx-auto">
        <MateriaForm />
      </div>
      <MateriaTable materias={materias} onEdit={() => {}} onInativar={() => {}} />
    </div>
  );
}
