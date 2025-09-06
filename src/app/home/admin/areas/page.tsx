'use client';

import React, { useEffect, useState } from 'react';
import AreaForm from '@/components/forms/AreaForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { AreaTable } from '@/components/tables/AreaTable';
import { areaService } from '@/services/area/AreaService';
import { Area } from '@/types/area';

export default function AreasAdminPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  useEffect(() => {
    areaService
      .listAll()
      .then(setAreas)
      .catch(() => setAreas([]));
  }, []);
  return (
    <ProtectedRoute>
      <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
        <div className="w-full max-w-md flex-shrink-0">
          <AreaForm />
        </div>
        <div className="flex-1">
          <AreaTable areas={areas} onEdit={() => {}} onInativar={() => {}} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
