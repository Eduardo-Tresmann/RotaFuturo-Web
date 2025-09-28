import React, { useEffect, useState } from 'react';
import { testeService, TesteQuestao } from '@/services/teste/TesteService';
import { Button } from '@/components/ui/button';
import { FormNotification } from '@/components/ui/form-components/form-notification';

const legend = [
  {
    value: 1,
    label: 'Não me identifico',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    emoji: '😡',
  },
  {
    value: 2,
    label: 'Pouco me identifico',
    color: 'bg-orange-400',
    textColor: 'text-orange-400',
    emoji: '🙁',
  },
  {
    value: 3,
    label: 'Neutro',
    color: 'bg-yellow-300',
    textColor: 'text-yellow-500',
    emoji: '😐',
  },
  {
    value: 4,
    label: 'Me identifico',
    color: 'bg-green-400',
    textColor: 'text-green-500',
    emoji: '🙂',
  },
  {
    value: 5,
    label: 'Me identifico muito',
    color: 'bg-green-700',
    textColor: 'text-green-700',
    emoji: '😄',
  },
];

interface SubareaTestStepperProps {
  testeId: number;
  usuarioId: number;
  areaId: number; // ID da área principal selecionada no teste vocacional anterior
  onFinish: () => void;
}

export const SubareaTestStepper: React.FC<SubareaTestStepperProps> = ({
  testeId,
  usuarioId,
  areaId,
  onFinish,
}) => {
  const [questions, setQuestions] = useState<TesteQuestao[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Use um estado para contar quantas respostas foram dadas para o progresso
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Buscamos as questões específicas para a área selecionada diretamente da API
        console.log(`Buscando questões para teste ID: ${testeId} e área ID: ${areaId}`);
        const qs = await testeService.listQuestoesByArea(testeId, areaId);
        console.log(`Questões recebidas: ${qs.length}`);

        setQuestions(qs);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar questões:', error);
        FormNotification.error({
          message: 'Erro ao carregar as questões do teste de subárea.',
        });
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testeId, areaId]);

  // Progresso do teste (0 a 100%)
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Questão atual
  const currentQuestion = questions[currentQuestionIndex];

  // Manipular seleção de resposta (apenas atualiza estado local)
  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Funçao central para salvar e navegar
  const handleNext = async () => {
    if (!currentQuestion) return;

    const currentAnswer = answers[currentQuestion.tesqId];
    if (!currentAnswer) {
      FormNotification.warning({
        message: 'Por favor, selecione uma opção para continuar.',
      });
      return;
    }

    setSubmitting(true);
    try {
      await testeService.responderQuestao(currentQuestion.tesqId, currentAnswer, usuarioId);

      // Checa se é a última questão
      if (currentQuestionIndex < questions.length - 1) {
        // Se não for a última, avança para a próxima
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Se for a última, marca o teste como completo
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      FormNotification.error({
        message: 'Ocorreu um erro ao salvar sua resposta. Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-zinc-900/90 p-5 sm:p-8 border-t border-x border-zinc-100 dark:border-zinc-800 min-h-[350px] flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-blue-600 border-blue-200 dark:border-t-blue-500 dark:border-blue-950/50 rounded-full animate-spin mb-4"></div>
          <div className="h-4 sm:h-6 bg-blue-200 dark:bg-blue-900/60 rounded w-48 sm:w-64 mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 bg-blue-100 dark:bg-blue-900/40 rounded w-36 sm:w-48"></div>
        </div>
        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-blue-600 dark:text-blue-400 font-semibold">
          Carregando questões do teste de subárea...
        </p>
      </div>
    );
  }

  // Verificar se há questões disponíveis
  if (questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-zinc-900/90 p-5 sm:p-8 border-t border-x border-zinc-100 dark:border-zinc-800 min-h-[350px] flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500 dark:text-yellow-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-gray-100">Nenhuma questão encontrada</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Não foram encontradas questões para o teste de subárea. Por favor, entre em contato com
            o administrador do sistema.
          </p>
        </div>
        <Button
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-3 sm:p-6 md:p-8 border-t border-x border-zinc-100 dark:border-zinc-800 min-h-[350px] flex flex-col gap-3 sm:gap-5 md:gap-6 shadow-md dark:shadow-zinc-950/50">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 dark:text-white">
        Teste de Especialidade
      </h2>

      {showIntro ? (
        <div className="flex flex-col items-center justify-center flex-grow py-3 sm:py-5">
          <div className="bg-blue-50 dark:bg-blue-950/40 rounded-lg p-4 sm:p-6 border border-blue-100 dark:border-blue-900 mb-6 text-center sm:text-left">
            <h3 className="text-md sm:text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3">
              Descubra sua especialidade!
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
              Este teste foi desenvolvido para ajudar você a identificar qual subárea ou curso mais
              combina com você dentro da área que você acabou de descobrir.
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
              Através de perguntas mais específicas sobre suas preferências e aptidões nesta área,
              vamos determinar qual curso ou especialidade melhor se alinha com seu perfil.
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
              <span className="font-medium dark:text-gray-200">Como funciona:</span> Você responderá
              a {questions.length} questões, escolhendo opções de "Discordo totalmente" a "Concordo
              totalmente". Seja sincero para obter um resultado mais preciso.
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              O teste leva aproximadamente 5 minutos para ser concluído e ao final você receberá uma
              recomendação da subárea/curso mais adequado ao seu perfil.
            </p>
          </div>
          <Button
            onClick={() => setShowIntro(false)}
            className="px-8 py-3 bg-blue-600 text-white font-medium text-base rounded-lg shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition w-full sm:w-auto"
          >
            Iniciar Teste de Especialidade
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-2 sm:mb-4 text-sm sm:text-base dark:text-gray-300">
            Para cada afirmação, marque a opção que melhor representa sua opinião:
          </p>

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 mb-1 sm:mb-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-3">
            Questão {currentQuestionIndex + 1} de {questions.length} ({Math.round(progress)}%)
          </div>

          {isComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="mb-6 text-center">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500 dark:text-green-400 sm:w-8 sm:h-8"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 dark:text-white">
                  Teste concluído!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Você respondeu todas as {questions.length} questões do teste de especialidade.
                </p>
              </div>
              <Button
                className="w-40 sm:w-48 px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition"
                onClick={onFinish}
                disabled={submitting}
              >
                Ver resultados
              </Button>
            </div>
          ) : currentQuestion ? (
            <div className="flex-1 flex flex-col">
              {/* Questão atual */}
              <div className="mb-8">
                <div className="p-3 sm:p-4 md:p-5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900 mb-4 sm:mb-6 md:mb-8">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 dark:text-white">
                    Pergunta {currentQuestionIndex + 1}
                  </h3>
                  <p className="font-medium text-sm sm:text-base md:text-lg dark:text-gray-300">
                    {currentQuestion.tesqDescricao}
                  </p>
                </div>{' '}
                {/* Slider com emojis */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <div className="flex justify-between gap-1 sm:gap-2 mb-2">
                    {legend.map((l) => (
                      <div key={l.value} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full ${
                            answers[currentQuestion.tesqId] === l.value ? l.color : 'bg-gray-200'
                          } 
                          flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-md transition-all duration-300 
                          ${
                            answers[currentQuestion.tesqId] &&
                            answers[currentQuestion.tesqId] >= l.value
                              ? 'ring-2 ring-offset-2 ring-blue-300'
                              : ''
                          } 
                          ${submitting ? 'opacity-70' : 'hover:scale-110 cursor-pointer'}`}
                          onClick={() =>
                            !submitting && handleAnswer(currentQuestion.tesqId, l.value)
                          }
                        >
                          {l.emoji}
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 text-center ${
                            answers[currentQuestion.tesqId] === l.value
                              ? l.textColor
                              : 'text-gray-500'
                          }`}
                        >
                          {l.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Barra colorida */}
                  <div className="relative h-1.5 sm:h-2 mt-4 sm:mt-6 mb-2 sm:mb-4">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/5 bg-red-500 rounded-l-full"></div>
                      <div className="w-1/5 bg-orange-400"></div>
                      <div className="w-1/5 bg-yellow-300"></div>
                      <div className="w-1/5 bg-green-400"></div>
                      <div className="w-1/5 bg-green-700 rounded-r-full"></div>
                    </div>

                    {/* Marcador */}
                    {answers[currentQuestion.tesqId] && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 bg-white border-2 border-blue-600 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-300"
                        style={{ left: `${((answers[currentQuestion.tesqId] - 1) / 4) * 100}%` }}
                      ></div>
                    )}
                  </div>
                </div>
                {/* Botão para próxima questão - container com altura fixa */}
                <div className="flex justify-center mt-2 sm:mt-4 md:mt-6 h-12 sm:h-14 relative">
                  <Button
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition w-full sm:w-auto"
                    onClick={handleNext}
                    disabled={submitting || !answers[currentQuestion.tesqId]}
                  >
                    {submitting
                      ? 'Salvando...'
                      : currentQuestionIndex < questions.length - 1
                      ? 'Próxima pergunta'
                      : 'Finalizar teste'}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
