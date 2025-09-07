import React, { useEffect, useState } from 'react';
import QuestaoForm from '@/app/home/admin/components/QuestaoForm';
import { QuestaoTable } from '@/app/home/admin/components/QuestaoTable';
import { questaoService } from '@/services/questao/QuestaoService';
import { Questao } from '@/types/questao';

export function QuestoesAdminContent() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  useEffect(() => {
    questaoService
      .listAll()
      .then(setQuestoes)
      .catch(() => setQuestoes([]));
  }, []);
  return (
    <div className="flex flex-col gap-10 w-full font-montserrat">
      <div className="w-full max-w-2xl mx-auto">
        <QuestaoForm />
      </div>
      <QuestaoTable questoes={questoes} onEdit={() => {}} onInativar={() => {}} />
    </div>
  );
}
