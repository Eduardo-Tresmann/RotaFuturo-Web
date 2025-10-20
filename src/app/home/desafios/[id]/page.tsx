'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeaderHome } from '@/components/HeaderHome';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import {
  desafioService,
  Desafio,
  QuestionarioComQuestoes,
  DesafioResposta,
} from '@/services/desafioService';
import { pessoaService } from '@/services/pessoa/PessoaService';
import {
  Loader2,
  ArrowLeft,
  Target,
  BookOpen,
  Layers,
  CheckCircle2,
  Circle,
  Trophy,
  X,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Send,
  AlertTriangle,
  Star,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/context/AuthContext';
import { FormNotification } from '@/components/ui/form-components/form-notification';

// Interface estendida para incluir nome do usuário no ranking
interface RankingComNome {
  desreId: number;
  desafioTitulo: string;
  usuarioId: number;
  usuarioNome?: string;
  desrePontuacao: number;
  desreAcertos: number;
  desreTotalQuestoes: number;
  desreDatacadastro: string;
}

export default function DesafioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { usuario } = useAuthContext();
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [questionario, setQuestionario] = useState<QuestionarioComQuestoes | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuestionario, setLoadingQuestionario] = useState(false);
  const [showQuestionario, setShowQuestionario] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState('');
  const [showRanking, setShowRanking] = useState(false);
  const [ranking, setRanking] = useState<RankingComNome[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = React.useRef(false); // Ref CRÍTICA para prevenir cliques múltiplos
  const answersRef = React.useRef<{ [key: number]: number }>({}); // Ref para answers sempre atualizada

  // Manter a ref de answers sincronizada
  React.useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (params.id) {
      loadDesafio(Number(params.id));
    }
  }, [params.id]);

  async function loadDesafio(id: number) {
    try {
      setLoading(true);
      const data = await desafioService.buscarPorId(id);
      setDesafio(data);
    } catch (err: any) {
      console.error('Erro ao carregar desafio:', err);
      setError('Não foi possível carregar o desafio. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  async function iniciarDesafio() {
    if (!desafio) return;

    try {
      setLoadingQuestionario(true);
      setError('');
      const data = await desafioService.buscarQuestionarioDoDesafio(desafio.desId);
      setQuestionario(data);
      setShowQuestionario(true);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err: any) {
      console.error('Erro ao carregar questionário:', err);
      setError('Não foi possível carregar o questionário do desafio. Tente novamente mais tarde.');
    } finally {
      setLoadingQuestionario(false);
    }
  }

  function handleAnswer(questaoId: number, alternativaId: number) {
    setAnswers((prev) => ({
      ...prev,
      [questaoId]: alternativaId,
    }));
  }

  function handleNext() {
    if (questionario && currentQuestionIndex < questionario.questoes.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }

  const handleSubmit = React.useCallback(async () => {
    // PROTEÇÃO CRÍTICA LOGO NO INÍCIO
    if (isSubmittingRef.current) {
      return; // Já está enviando, ignora silenciosamente
    }

    // VALIDAÇÕES PRÉ-VERIFICAÇÃO (antes de bloquear)
    if (!desafio || !questionario || !usuario) {
      return;
    }

    // Calcular valores localmente para ter certeza usando a ref
    const currentAnswers = answersRef.current;
    const localAnsweredCount = Object.keys(currentAnswers).length;
    const localTotalQuestions = questionario?.questoes.length || 0;
    const localAllAnswered = localAnsweredCount === localTotalQuestions;

    if (!localAllAnswered) {
      const faltam = localTotalQuestions - localAnsweredCount;
      FormNotification.warning({
        message: `⚠️ Atenção!\nVocê ainda precisa responder ${faltam} ${
          faltam === 1 ? 'questão' : 'questões'
        }.\nRevise suas respostas antes de enviar! 📝`,
        duration: 4000,
      });
      return;
    }

    // BLOQUEAR IMEDIATAMENTE - Esta linha é CRÍTICA
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    FormNotification.info({
      message: `📤 Enviando suas respostas...\nAguarde enquanto calculamos sua pontuação! ⏳`,
      duration: 2000,
    });

    try {
      setLoadingQuestionario(true);

      const currentAnswers = answersRef.current;
      const respostas = questionario.questoes.map((q) => ({
        questaoId: q.questaoId,
        alternativaId: currentAnswers[q.questaoId],
      }));

      const respostaDTO: DesafioResposta = {
        desafioId: desafio.desId,
        usuarioId: usuario.usuId,
        respostas,
      };

      const resultado = await desafioService.enviarRespostas(respostaDTO);

      const pontuacao = resultado.desrePontuacao;
      const pontuacaoFormatada = pontuacao.toFixed(1);
      const acertos = resultado.desreAcertos;
      const total = resultado.desreTotalQuestoes;

      let emoji = '🎉';
      let titulo = '';
      let mensagem = '';

      if (pontuacao === 100) {
        emoji = '🏆';
        titulo = 'PERFEITO!';
        mensagem = `Incrível! Você acertou todas as ${total} questões! 💯✨`;
        FormNotification.success({
          message: `${emoji} ${titulo}\n${mensagem}\nPontuação: ${pontuacaoFormatada}%`,
          duration: 5000,
        });
      } else if (pontuacao >= 90) {
        emoji = '⭐';
        titulo = 'EXCELENTE!';
        mensagem = `Impressionante! ${acertos} de ${total} questões corretas! Continue assim! 🚀`;
        FormNotification.success({
          message: `${emoji} ${titulo}\n${mensagem}\nPontuação: ${pontuacaoFormatada}%`,
          duration: 4500,
        });
      } else if (pontuacao >= 70) {
        emoji = '🎯';
        titulo = 'MUITO BOM!';
        mensagem = `Ótimo trabalho! ${acertos} de ${total} questões corretas! 👏`;
        FormNotification.success({
          message: `${emoji} ${titulo}\n${mensagem}\nPontuação: ${pontuacaoFormatada}%`,
          duration: 4000,
        });
      } else if (pontuacao >= 50) {
        emoji = '💪';
        titulo = 'BOM ESFORÇO!';
        mensagem = `Continue praticando! ${acertos} de ${total} questões corretas. Você está melhorando! 📚`;
        FormNotification.warning({
          message: `${emoji} ${titulo}\n${mensagem}\nPontuação: ${pontuacaoFormatada}%`,
          duration: 4000,
        });
      } else {
        emoji = '📖';
        titulo = 'PRECISA ESTUDAR MAIS!';
        mensagem = `${acertos} de ${total} questões corretas. Não desista, tente novamente! 💡`;
        FormNotification.warning({
          message: `${emoji} ${titulo}\n${mensagem}\nPontuação: ${pontuacaoFormatada}%`,
          duration: 4000,
        });
      }

      setTimeout(() => {
        router.push('/home/desafios');
      }, 3000);
    } catch (err: any) {
      console.error('❌ Erro ao enviar respostas:', err);
      FormNotification.error({
        message: `❌ Ops! Algo deu errado...\nNão foi possível enviar suas respostas.\nPor favor, tente novamente em alguns instantes. 🔄`,
        duration: 5000,
      });
    } finally {
      setLoadingQuestionario(false);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [desafio, questionario, usuario, router]);

  // Wrapper para o botão que simplesmente chama handleSubmit
  const handleSubmitClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    },
    [handleSubmit],
  );

  async function loadRanking() {
    if (!desafio) return;

    try {
      setLoadingRanking(true);
      const data = await desafioService.buscarRankingDesafio(desafio.desId);

      // Buscar os nomes dos usuários
      const rankingComNomes = await Promise.all(
        data.map(async (item) => {
          try {
            const pessoa = await pessoaService.getPessoaByUsuarioId(item.usuarioId);
            return {
              ...item,
              usuarioNome: pessoa?.pesApelido || pessoa?.pesNome || `Usuário #${item.usuarioId}`,
            };
          } catch (error) {
            console.error(`Erro ao buscar pessoa do usuário ${item.usuarioId}:`, error);
            return {
              ...item,
              usuarioNome: `Usuário #${item.usuarioId}`,
            };
          }
        }),
      );

      setRanking(rankingComNomes);
      setShowRanking(true);
    } catch (err: any) {
      console.error('Erro ao carregar ranking:', err);
      FormNotification.error({
        message: 'Não foi possível carregar o ranking.',
      });
    } finally {
      setLoadingRanking(false);
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questionario?.questoes.length || 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const currentQuestion = questionario?.questoes[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = answeredCount === totalQuestions;

  function getNivelColor(nivel: string | undefined): string {
    switch (nivel?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'médio':
      case 'medio':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'difícil':
      case 'dificil':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-700';
    }
  }

  return (
    <ProtectedRoute>
      <HeaderHome
        extra={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/home/desafios">Desafios</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{desafio?.desTitulo || 'Carregando...'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Botão voltar */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors font-medium opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar para Desafios</span>
          </button>

          {loading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-ping" />
              </div>
            </div>
          )}

          {error && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 animate-shake">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && desafio && !showQuestionario && (
            <div className="space-y-6">
              {/* Header Card - Animação */}
              <Card className="overflow-hidden dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 p-6 sm:p-8">
                  <div className="absolute inset-0 bg-[url('/imagens/pattern.svg')] opacity-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                          {desafio.desTitulo}
                        </h1>
                        <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">
                          {desafio.desDescricao}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {desafio.nivel && (
                        <div
                          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 font-semibold text-xs sm:text-sm ${getNivelColor(
                            desafio.nivel.nivDescricao,
                          )} backdrop-blur-sm`}
                        >
                          <Layers className="w-4 h-4" />
                          <span>{desafio.nivel.nivDescricao}</span>
                        </div>
                      )}
                      {desafio.area && (
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-lg border-2 border-white/50 dark:border-gray-700 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-200 backdrop-blur-sm">
                          <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>{desafio.area.areaDescricao}</span>
                        </div>
                      )}
                      {desafio.areaSub && (
                        <div className="px-3 sm:px-4 py-2 bg-white/90 dark:bg-gray-800/90 rounded-lg border-2 border-white/50 dark:border-gray-700 font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-200 backdrop-blur-sm">
                          {desafio.areaSub.areasDescricao}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Conteúdo */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_forwards]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Sobre o Desafio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {desafio.desDescricao}
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 opacity-0 animate-[slideUp_0.6s_ease-out_0.3s_forwards]">
                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Nível
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {desafio.nivel?.nivDescricao || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Área</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {desafio.area?.areaDescricao || 'Geral'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Criado em
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {new Date(desafio.desDatacadastro).toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 opacity-0 animate-[slideUp_0.6s_ease-out_0.4s_forwards]">
                <Button
                  onClick={loadRanking}
                  disabled={loadingRanking}
                  className="px-6 sm:px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {loadingRanking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5 mr-2" />
                      Ver Ranking
                    </>
                  )}
                </Button>

                <Button
                  onClick={iniciarDesafio}
                  disabled={loadingQuestionario}
                  className="px-8 sm:px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {loadingQuestionario ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Iniciar Desafio
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Questionário */}
          {!loading && !error && desafio && showQuestionario && questionario && (
            <div className="space-y-6">
              {/* Header com Progresso */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
                <CardHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {desafio.desTitulo}
                      </CardTitle>
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          Questão {currentQuestionIndex + 1} de {totalQuestions}
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {answeredCount} de {totalQuestions} respondidas
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Mini navegação */}
                    <div className="flex flex-wrap gap-2">
                      {questionario.questoes.map((q, idx) => (
                        <button
                          key={q.questaoId}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            idx === currentQuestionIndex
                              ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800 scale-110'
                              : answers[q.questaoId]
                              ? 'bg-green-500 dark:bg-green-600 text-white hover:scale-105'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Questão Atual */}
              {currentQuestion && (
                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_forwards]">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                        {currentQuestionIndex + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 leading-relaxed mb-3">
                          {currentQuestion.questaoDescricao}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Código: {currentQuestion.questaoCodigo}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-xs text-blue-700 dark:text-blue-400 font-medium">
                            {currentQuestion.questaoTipo}
                          </span>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {currentQuestion.questaoExperiencia} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                        Selecione a alternativa correta:
                      </label>
                      {currentQuestion.alternativas.map((alternativa, index) => (
                        <label
                          key={alternativa.quesaId}
                          className={`group flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            answers[currentQuestion.questaoId] === alternativa.quesaId
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-[1.02]'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`questao-${currentQuestion.questaoId}`}
                            value={alternativa.quesaId}
                            checked={answers[currentQuestion.questaoId] === alternativa.quesaId}
                            onChange={() =>
                              handleAnswer(currentQuestion.questaoId, alternativa.quesaId)
                            }
                            className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {String.fromCharCode(65 + index)})
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200">
                              {alternativa.quesaDescricao}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navegação */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 opacity-0 animate-[slideUp_0.6s_ease-out_0.3s_forwards]">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="px-6 py-6 border-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 font-semibold"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Anterior
                </Button>

                <div className="flex gap-3">
                  {!isLastQuestion ? (
                    <Button
                      onClick={handleNext}
                      className="px-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold"
                    >
                      Próxima
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitClick}
                      disabled={!allAnswered || loadingQuestionario || isSubmitting}
                      className="px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold pointer-events-auto"
                      type="button"
                    >
                      {loadingQuestionario || isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Respostas
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Alerta */}
              {isLastQuestion && !allAnswered && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 opacity-0 animate-[slideUp_0.6s_ease-out_0.4s_forwards]">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                          Você ainda tem questões não respondidas
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                          Responda todas as questões antes de enviar o desafio.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Ranking */}
      {showRanking && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
          <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden dark:bg-gray-800 dark:border-gray-700 animate-[slideUp_0.3s_ease-out]">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-b dark:border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Ranking do Desafio
                    </CardTitle>
                    <CardDescription className="mt-1 dark:text-gray-400">
                      Top pontuações de {desafio?.desTitulo}
                    </CardDescription>
                  </div>
                </div>
                <button
                  onClick={() => setShowRanking(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 max-h-[calc(85vh-140px)] overflow-y-auto">
              {ranking.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Ainda não há registros para este desafio. Seja o primeiro!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ranking.map((item, index) => (
                    <div
                      key={item.desreId}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-300 dark:border-gray-600'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-300 dark:border-orange-700'
                          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-xl ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {item.usuarioNome}
                          </span>
                          {item.usuarioId === usuario?.usuId && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {item.desreAcertos}/{item.desreTotalQuestoes} acertos
                          </span>
                          <span>•</span>
                          <span>{formatDate(item.desreDatacadastro)}</span>
                        </div>
                      </div>

                      <div
                        className={`text-2xl font-bold ${
                          item.desrePontuacao >= 90
                            ? 'text-green-600 dark:text-green-400'
                            : item.desrePontuacao >= 70
                            ? 'text-blue-600 dark:text-blue-400'
                            : item.desrePontuacao >= 50
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {item.desrePontuacao.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </ProtectedRoute>
  );
}
