import React, { useEffect, useState } from 'react';
import { AreaSub } from '@/types/areasub';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { Button } from '@/components/ui/button';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  GraduationCap,
  BookOpenCheck,
  TrendingUp,
  BarChart4,
  ThumbsUp,
  PenTool,
} from 'lucide-react';
import { usuarioAreaService } from '@/services/usuarioarea/UsuarioAreaService';
import { baseApiService } from '@/services/baseApiService';

// Interface para resultados do teste de subárea
export interface SubareaTestResult {
  areaId: number;
  areaDescricao: string;
  pontuacao: number;
}

// Serviço para obter resultados do teste de subárea
class SubareaTestService {
  async getTesteResults(
    testeId: number,
    usuarioId: number,
    areaId: number,
  ): Promise<SubareaTestResult[]> {
    try {
      // Endpoint para obter os resultados do teste de subárea
      // Utilizando o baseApiService para manter a consistência com outros serviços
      const endpoint = `/teste/${testeId}/resultado/${usuarioId}/area/${areaId}`;
      console.log('Chamando endpoint:', endpoint);

      const results = await baseApiService.request<SubareaTestResult[]>(endpoint);

      console.log('Resultados recebidos da API:', results);
      return results;
    } catch (error) {
      console.error('Erro ao buscar resultados do teste de subárea:', error);
      throw error;
    }
  }
}
const subareaTestService = new SubareaTestService();

interface SubareaTestResultStepperProps {
  testeId: number;
  usuarioId: number;
  areaId: number; // ID da área principal selecionada
  onBack: () => void;
  onNext: () => void;
}

export const SubareaTestResultStepper: React.FC<SubareaTestResultStepperProps> = ({
  testeId,
  usuarioId,
  areaId,
  onBack,
  onNext,
}) => {
  const [loading, setLoading] = useState(true);
  const [subareas, setSubareas] = useState<AreaSub[]>([]);
  const [results, setResults] = useState<SubareaTestResult[]>([]);
  const [matchedSubarea, setMatchedSubarea] = useState<AreaSub | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verificar se já temos resultados armazenados no localStorage
        const storedResultsKey = `subarea_results_${testeId}_${usuarioId}_${areaId}`;
        const storedResultsData = localStorage.getItem(storedResultsKey);
        const storedMatchedSubareaKey = `subarea_matchedSubarea_${testeId}_${usuarioId}_${areaId}`;
        const storedMatchedSubareaData = localStorage.getItem(storedMatchedSubareaKey);

        // Buscar todas as subáreas disponíveis para a área selecionada (sempre necessário)
        const allSubareas = await areaSubService.listAll();
        const filteredSubareas = allSubareas.filter((sub) => sub.areaId === areaId);
        setSubareas(filteredSubareas);

        // Se já temos resultados armazenados, usá-los
        if (storedResultsData && storedMatchedSubareaData) {
          console.log('Usando resultados armazenados do localStorage');
          const parsedResults = JSON.parse(storedResultsData);
          setResults(parsedResults);

          const parsedMatchedSubareaId = JSON.parse(storedMatchedSubareaData);
          const matchedSubareaData =
            filteredSubareas.find((sub) => sub.areasId === parsedMatchedSubareaId) || null;
          setMatchedSubarea(matchedSubareaData);

          setLoading(false);
          return;
        }

        try {
          // 2. Buscar os resultados do teste de subárea
          console.log(
            `Buscando resultados para teste de subárea ID: ${testeId}, usuário ID: ${usuarioId}, área ID: ${areaId}`,
          );

          // Buscar resultados reais da API
          const testeResults = await subareaTestService.getTesteResults(testeId, usuarioId, areaId);

          // Verificar se há resultados válidos
          if (testeResults && testeResults.length > 0) {
            // Ordenar por pontuação (do maior para o menor)
            testeResults.sort((a, b) => b.pontuacao - a.pontuacao);
            setResults(testeResults);

            // A subárea com maior pontuação é a mais compatível
            const bestMatch = testeResults[0];
            const matchedSubareaData =
              filteredSubareas.find((sub) => sub.areasId === bestMatch.areaId) || null;
            setMatchedSubarea(matchedSubareaData);

            // Armazenar no localStorage para uso futuro
            localStorage.setItem(storedResultsKey, JSON.stringify(testeResults));
            if (matchedSubareaData) {
              localStorage.setItem(
                storedMatchedSubareaKey,
                JSON.stringify(matchedSubareaData.areasId),
              );
            }
          } else {
            // Se não retornar resultados, notificar ao usuário
            FormNotification.warning({
              message:
                'Não foram encontrados resultados para o teste. Verifique se você respondeu todas as questões.',
            });

            // Defina resultados vazios
            setResults([]);
            setMatchedSubarea(null);
          }
        } catch (error) {
          console.error('Erro ao buscar resultados:', error);
          FormNotification.error({
            message:
              'Não foi possível carregar seus resultados. Por favor, tente novamente mais tarde.',
          });

          // Em caso de erro, deixamos os resultados vazios em vez de criar vazios com pontuação zero
          setResults([]);
          setMatchedSubarea(null);
        }

        setLoading(false);
      } catch (error) {
        FormNotification.error({ message: 'Erro ao buscar resultados do teste de subárea' });
        setLoading(false);
      }
    };

    fetchData();
  }, [testeId, usuarioId, areaId]);

  const handleSavePreference = async () => {
    try {
      setSubmitting(true);

      if (!matchedSubarea) {
        FormNotification.warning({ message: 'Nenhuma especialidade foi selecionada.' });
        return;
      }

      // Vincular usuário à subárea escolhida
      if (usuarioId) {
        // Salvar área principal
        await usuarioAreaService.vincularUsuarioArea(usuarioId, areaId);

        // NOTA: Endpoint para vincular subárea ainda não existe no backend
        // Por enquanto, apenas salvamos a área principal e armazenamos a subárea localmente
        // TODO: Implementar quando o endpoint estiver disponível
        // await usuarioAreaService.vincularUsuarioSubarea(usuarioId, matchedSubarea.areasId);

        // Armazenar a subárea localmente para mostrar na interface
        localStorage.setItem(
          `selected_subarea_${usuarioId}`,
          JSON.stringify({
            subareaId: matchedSubarea.areasId,
            areaId: areaId,
          }),
        );

        FormNotification.success({ message: 'Especialidade salva com sucesso!' });
        onNext();
      }
    } catch (error) {
      FormNotification.error({ message: 'Erro ao salvar especialidade' });
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
            Resultados do Teste de Especialidade
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Identificamos as especialidades ou cursos mais adequados ao seu perfil.
          </p>
        </div>
      </div>{' '}
      {/* Conteúdo principal */}
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-b-xl overflow-hidden">
        {/* Área de resultado principal */}
        {results.length === 0 ? (
          <div className="p-6 md:p-8 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-zinc-800">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
                Não encontramos resultados para seu teste
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você precisa completar o teste de especialidade para ver seus resultados. Por favor,
                retorne à etapa anterior e responda todas as questões.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-800">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-3 sm:p-4">
                <ThumbsUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
                  Sua especialidade recomendada é:
                </h2>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1 break-words hyphens-auto">
                  {matchedSubarea?.areasDescricao || 'Especialidade não encontrada'}
                </h3>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Esta especialidade foi identificada com base nas suas respostas e representa a área
              específica que melhor se alinha com seus interesses e aptidões.
            </p>
          </div>
        )}

        {/* Lista de resultados */}
        {results.length > 0 && (
          <div className="px-4 sm:px-6 py-5 sm:py-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
              Todas as especialidades analisadas:
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {results.map((result, index) => (
                <div
                  key={result.areaId}
                  className={`p-2 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 ${
                    index === 0
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div
                    className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className="font-bold text-white text-sm sm:text-base">{index + 1}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4
                      className={`font-semibold text-sm sm:text-base line-clamp-1 ${
                        index === 0
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {result.areaDescricao}
                    </h4>
                    <div className="mt-1 flex items-center">
                      <div className="flex-grow h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-2 ${
                            index === 0
                              ? 'bg-blue-500 dark:bg-blue-400'
                              : 'bg-gray-400 dark:bg-gray-500'
                          }`}
                          style={{ width: `${(result.pontuacao / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {result.pontuacao}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerta informativo sobre a seleção manual no próximo passo */}
        <div className="mt-8 px-6 py-4 border border-dashed border-blue-300 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 mx-6">
          <div className="flex items-center text-blue-600 dark:text-blue-400 justify-center">
            <PenTool className="mr-2 h-4 w-4" />
            <p className="text-sm sm:text-base">
              Não gostou dos resultados? Você poderá selecionar manualmente no próximo passo
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 w-full sm:w-auto text-sm sm:text-base"
            onClick={onBack}
            disabled={submitting}
            size="sm"
          >
            Voltar
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-blue-600 text-white font-semibold hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
              onClick={handleSavePreference}
              disabled={submitting}
              size="sm"
            >
              {submitting ? 'Salvando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
