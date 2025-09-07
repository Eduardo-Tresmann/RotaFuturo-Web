import React, { useEffect, useState } from 'react';
import QuestionarioForm from '@/app/home/admin/components/QuestionarioForm';
import { QuestionarioTable } from '@/app/home/admin/components/QuestionarioTable';
import { questionarioService } from '@/services/questionario/QuestionarioService';
import { Questionario } from '@/types/questionario';

export function QuestionariosAdminContent() {
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  useEffect(() => {
    questionarioService
      .listAll()
      .then(setQuestionarios)
      .catch(() => setQuestionarios([]));
  }, []);
  return (
    <div className="flex flex-col gap-10 w-full font-montserrat">
      <div className="w-full max-w-2xl mx-auto">
        <QuestionarioForm />
      </div>
      <QuestionarioTable
        questionarios={questionarios}
        onEdit={() => {}}
        onInativar={() => {}}
      />
    </div>
  );
}
