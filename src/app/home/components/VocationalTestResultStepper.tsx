import React, { useEffect, useState } from 'react';
import { Area } from '@/types/area';
import { areaService } from '@/services/area/AreaService';
import { Button } from '@/components/ui/button';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  BarChart4,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { usePessoa } from '@/hooks/usePessoa';
import { vocationalTestService, TesteResult } from '@/services/teste/VocationalTestService';
import { usuarioAreaService } from '@/services/usuarioarea/UsuarioAreaService';

interface VocationalTestResultStepperProps {
  testeId: number;
  usuarioId: number;
  onBack: () => void;
  onNext: (areaId: number) => void;
}

export const VocationalTestResultStepper: React.FC<VocationalTestResultStepperProps> = ({
  testeId,
  usuarioId,
  onBack,
  onNext,
}) => {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [results, setResults] = useState<TesteResult[]>([]);
  const [matchedArea, setMatchedArea] = useState<Area | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setPessoa } = usePessoa();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verificar se já temos resultados armazenados no localStorage
        const storedResultsKey = `vocacional_results_${testeId}_${usuarioId}`;
        const storedResultsData = localStorage.getItem(storedResultsKey);
        const storedMatchedAreaKey = `vocacional_matchedArea_${testeId}_${usuarioId}`;
        const storedMatchedAreaData = localStorage.getItem(storedMatchedAreaKey);

        // 1. Buscar todas as áreas disponíveis (sempre necessário)
        const allAreas = await areaService.listAll();
        setAreas(allAreas);

        // Se já temos resultados armazenados, usá-los
        if (storedResultsData && storedMatchedAreaData) {
          console.log('Usando resultados armazenados do localStorage');
          const parsedResults = JSON.parse(storedResultsData);
          setResults(parsedResults);

          const parsedMatchedAreaId = JSON.parse(storedMatchedAreaData);
          const matchedAreaData = allAreas.find((a) => a.areaId === parsedMatchedAreaId) || null;
          setMatchedArea(matchedAreaData);

          setLoading(false);
          return;
        }

        try {
          // 2. Buscar os resultados do teste vocacional
          console.log(`Buscando resultados para teste ID: ${testeId} e usuário ID: ${usuarioId}`);
          const testeResults = await vocationalTestService.getTesteResults(testeId, usuarioId);
          console.log('Resultados do teste recebidos:', testeResults);

          // Verificar se os resultados têm pontuações válidas
          const hasValidScores = testeResults.some((result) => result.pontuacao > 0);

          // Se houver resultados válidos da API
          if (hasValidScores && testeResults.length > 0) {
            // Ordenar por pontuação (do maior para o menor)
            testeResults.sort((a, b) => b.pontuacao - a.pontuacao);
            setResults(testeResults);

            // A área com maior pontuação é a mais compatível
            const bestMatch = testeResults[0];
            const matchedAreaData = allAreas.find((a) => a.areaId === bestMatch.areaId) || null;
            setMatchedArea(matchedAreaData);

            // Armazenar no localStorage para uso futuro
            localStorage.setItem(storedResultsKey, JSON.stringify(testeResults));
            if (matchedAreaData) {
              localStorage.setItem(storedMatchedAreaKey, JSON.stringify(matchedAreaData.areaId));
            }
          }
          // Se não houver resultados reais, mostrar apenas uma mensagem
          else {
            FormNotification.warning({
              message:
                'Não encontramos resultados para seu teste vocacional. Por favor, complete o teste primeiro.',
            });

            // Defina resultados vazios
            setResults([]);
            setMatchedArea(null);
          }
        } catch (error) {
          console.error('Erro ao buscar resultados:', error);
          FormNotification.error({
            message:
              'Não foi possível carregar seus resultados. Por favor, tente novamente mais tarde.',
          });

          // Em caso de erro, deixamos os resultados vazios em vez de gerar simulados
          setResults([]);
          setMatchedArea(null);
        }

        setLoading(false);
      } catch (error) {
        FormNotification.error({ message: 'Erro ao buscar resultados do teste' });
        setLoading(false);
      }
    };

    fetchData();
  }, [testeId, usuarioId]);

  const handleSavePreference = async () => {
    if (!matchedArea) return;

    try {
      setSubmitting(true);

      // Atualizar a área de interesse da pessoa
      if (usuarioId) {
        // Método 1: Vincular através da nova tabela USUARIOAREA
        // Este método funciona mesmo se o usuário ainda não tem um perfil criado
        await usuarioAreaService.vincularUsuarioArea(usuarioId, matchedArea.areaId);

        try {
          // Método 2: Verificar se o usuário já tem um perfil (pessoa) e atualizar se existir
          const currentPessoa = await pessoaService.getPessoaByUsuarioId(usuarioId);

          // Se existir um perfil, atualizar a área de interesse
          if (currentPessoa) {
            // Atualizar a área de interesse
            const updatedPessoa = await pessoaService.updatePessoa(currentPessoa.pesId, {
              ...currentPessoa,
              areaId: matchedArea.areaId,
            });

            // Atualizar o estado global da pessoa
            setPessoa(updatedPessoa);
          }
          // Se não existir perfil, não fazemos nada - o usuário vai criar o perfil depois
        } catch (pessoaError) {
          // Ignorar erros aqui, já que é esperado que o usuário ainda não tenha um perfil
          console.log('Usuário ainda não tem perfil, continuando fluxo normal.');
        }

        FormNotification.success({ message: 'Área de interesse salva com sucesso!' });
        onNext(matchedArea.areaId);
      }
    } catch (error) {
      FormNotification.error({ message: 'Erro ao salvar área de interesse' });
      console.error('Erro ao salvar preferência:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col min-h-[50vh] sm:min-h-[60vh]">
        {/* Conteúdo central */}
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-24 w-24 sm:h-32 sm:w-32 bg-blue-200 dark:bg-blue-800/50 rounded-full mb-3 sm:mb-4 flex items-center justify-center">
              <BarChart4 size={48} className="text-blue-400 dark:text-blue-500" />
            </div>
            <div className="h-5 sm:h-6 bg-blue-200 dark:bg-blue-800/50 rounded w-48 sm:w-64 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-blue-100 dark:bg-blue-900/50 rounded w-36 sm:w-48"></div>
            <p className="mt-6 sm:mt-8 text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">
              Analisando suas respostas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col px-2 sm:px-0">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 py-4 sm:py-6 md:py-8 px-3 sm:px-4 rounded-t-xl text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 rounded-full w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
            Resultado do Teste Vocacional
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Identificamos as áreas mais compatíveis com seu perfil e interesses.
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-b-xl overflow-hidden">
        {results.length === 0 ? (
          <div className="p-6 md:p-8 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-zinc-800">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
                Não encontramos resultados para seu teste
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você precisa completar o teste vocacional para ver seus resultados. Por favor,
                retorne à etapa anterior e responda todas as questões.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-4">
              <ThumbsUp className="text-blue-600 dark:text-blue-400" /> Área mais compatível com seu
              perfil:
            </h3>

            {matchedArea && (
              <div className="bg-white dark:bg-zinc-700 rounded-lg p-4 sm:p-6 shadow-sm">
                <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                  {matchedArea.areaDescricao}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                  Esta área do conhecimento combina com suas habilidades e interesses demonstrados
                  no teste.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                  <BookOpenCheck />
                  <span>Compatibilidade alta</span>
                </div>
              </div>
            )}

            {results.length > 1 && (
              <div className="mt-6 md:mt-8">
                <h3 className="text-md md:text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-4">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" /> Seus resultados por
                  área:
                </h3>
                <div className="bg-white dark:bg-zinc-700 rounded-lg p-3 sm:p-4 shadow-sm">
                  {results.map((result, index) => (
                    <div key={result.areaId} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm sm:text-base line-clamp-1 dark:text-gray-200">
                          {result.areaDescricao}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold ml-1 dark:text-gray-300">
                          {result.pontuacao}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            index === 0
                              ? 'bg-blue-600 dark:bg-blue-500'
                              : index === 1
                              ? 'bg-green-500 dark:bg-green-400'
                              : index === 2
                              ? 'bg-yellow-400 dark:bg-yellow-300'
                              : 'bg-purple-500 dark:bg-purple-400'
                          }`}
                          style={{ width: `${result.pontuacao}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <p>
                Este resultado é baseado nas suas respostas ao teste vocacional. Ele serve como um
                guia para ajudar na sua escolha de carreira, mas não deve ser o único fator na sua
                decisão.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botões de navegação */}
      <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 w-full sm:w-auto"
            onClick={onBack}
            disabled={submitting}
            size="sm"
          >
            Voltar
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              onClick={handleSavePreference}
              disabled={submitting || !matchedArea}
              size="sm"
            >
              {submitting ? 'Salvando...' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
