import React, { useEffect, useState } from 'react';
import { testeService, TesteQuestao } from '@/services/teste/TesteService';
import { Button } from '@/components/ui/button';

const legend = [
  { value: 1, label: 'Discordo totalmente', color: 'bg-red-500' },
  { value: 2, label: 'Discordo', color: 'bg-orange-400' },
  { value: 3, label: 'Neutro', color: 'bg-yellow-300' },
  { value: 4, label: 'Concordo', color: 'bg-green-400' },
  { value: 5, label: 'Concordo totalmente', color: 'bg-green-700' },
];

interface VocationalTestStepperProps {
  testeId: number;
  usuarioId: number;
  onFinish: () => void;
}

export const VocationalTestStepper: React.FC<VocationalTestStepperProps> = ({
  testeId,
  usuarioId,
  onFinish,
}) => {
  const [questions, setQuestions] = useState<TesteQuestao[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    testeService.listQuestoes(testeId).then((qs) => {
      setQuestions(qs);
      setLoading(false);
    });
  }, [testeId]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.tesqId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    for (const q of questions) {
      await testeService.responderQuestao(q.tesqId, answers[q.tesqId], usuarioId);
    }
    setSubmitting(false);
    onFinish();
  };

  if (loading) return <div>Carregando questões...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 min-h-[400px] flex flex-col gap-8">
      <h2 className="text-xl font-bold mb-2">Teste Vocacional</h2>
      <p className="mb-4 text-base">
        Para cada afirmação, marque a opção que melhor representa sua opinião:
      </p>
      <div className="mb-6 flex gap-2 justify-center">
        {legend.map((l) => (
          <div key={l.value} className={`flex flex-col items-center mx-2`}>
            <div
              className={`w-8 h-8 rounded-full ${l.color} flex items-center justify-center text-white font-bold`}
            >
              {l.value}
            </div>
            <span className="text-xs mt-1">{l.label}</span>
          </div>
        ))}
      </div>
      <form className="flex flex-col gap-6">
        {questions.map((q) => (
          <div key={q.tesqId} className="flex flex-col gap-2">
            <span className="font-medium">{q.tesqDescricao}</span>
            <div className="flex gap-4 mt-2">
              {legend.map((l) => (
                <label key={l.value} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.tesqId}`}
                    value={l.value}
                    checked={answers[q.tesqId] === l.value}
                    onChange={() => handleAnswer(q.tesqId, l.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-8 h-8 rounded-full ${
                      l.color
                    } flex items-center justify-center text-white font-bold border-2 ${
                      answers[q.tesqId] === l.value ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    {l.value}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </form>
      <Button
        className="w-36 px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition text-base mt-8"
        disabled={!allAnswered || submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Enviando...' : 'Finalizar'}
      </Button>
    </div>
  );
};
