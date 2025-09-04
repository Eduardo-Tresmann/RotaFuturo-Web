'use client';
import React, { useEffect, useState } from 'react';
import AreaSubForm from '@/components/forms/AreaSubForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { AreaSubTable } from '@/components/tables/AreaSubTable';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { AreaSub } from '@/types/areasub';

export default function AreaSubAdminPage() {
  const [areasub, setAreaSub] = useState<AreaSub[]>([]);
  useEffect(() => {
    areaSubService
      .listAll()
      .then(setAreaSub)
      .catch(() => setAreaSub([]));
  }, []);
  return (
    <ProtectedRoute>
      <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
        <div className="w-full max-w-md flex-shrink-0">
          <AreaSubForm />
        </div>
        <div className="flex-1">
          <AreaSubTable areaSubs={areasub} onEdit={() => {}} onInativar={() => {}} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
