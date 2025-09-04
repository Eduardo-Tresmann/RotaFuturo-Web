'use client';
import React, { useEffect, useState } from 'react';
import QuestaoForm from '@/components/forms/QuestaoForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { QuestaoTable } from '@/components/tables/QuestaoTable';
import { questaoService } from '@/services/questao/QuestaoService';
import { Questao } from '@/types/questao';

export default function QuestoesAdminPage() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  useEffect(() => {
    questaoService
      .listAll()
      .then(setQuestoes)
      .catch(() => setQuestoes([]));
  }, []);
  return (
    <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
      <div className="w-full max-w-md flex-shrink-0">
        <QuestaoForm />
      </div>
      <div className="flex-1">
        <QuestaoTable questoes={questoes} onEdit={() => {}} onInativar={() => {}} />
      </div>
    </div>
  );
}
