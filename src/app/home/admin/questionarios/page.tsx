'use client';
import React, { useEffect, useState } from 'react';
import QuestionarioForm from '@/components/forms/QuestionarioForm';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { QuestionarioTable } from '@/components/tables/QuestionarioTable';
import { questionarioService } from '@/services/questionario/QuestionarioService';
import { Questionario } from '@/types/questionario';

export default function QuestionariosAdminPage() {
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  useEffect(() => {
    questionarioService
      .listAll()
      .then(setQuestionarios)
      .catch(() => setQuestionarios([]));
  }, []);
  return (
    <div className="flex flex-row gap-8 w-full h-full min-h-[600px]">
      <div className="w-full max-w-md flex-shrink-0">
        <QuestionarioForm />
      </div>
      <div className="flex-1">
        <QuestionarioTable questionarios={questionarios} onEdit={() => {}} onInativar={() => {}} />
      </div>
    </div>
  );
}
