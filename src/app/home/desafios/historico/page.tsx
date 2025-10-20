'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { desafioService, DesafioRealizado, EstatisticasUsuario } from '@/services/desafioService';
import {
  Loader2,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Zap,
  History,
  ArrowRight,
  Filter,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuthContext } from '@/components/context/AuthContext';

export default function HistoricoDesafiosPage() {
  const router = useRouter();
  const { usuario } = useAuthContext();
  const [historico, setHistorico] = useState<DesafioRealizado[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'perfeitos' | 'bons' | 'regulares'>('todos');

  useEffect(() => {
    if (usuario) {
      loadData();
    }
  }, [usuario]);

  async function loadData() {
    if (!usuario) return;

    try {
      setLoading(true);
      const [historicoData, estatisticasData] = await Promise.all([
        desafioService.buscarHistoricoUsuario(usuario.usuId),
        desafioService.buscarEstatisticasUsuario(usuario.usuId),
      ]);
      setHistorico(historicoData);
      setEstatisticas(estatisticasData);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar seu histórico. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
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

  function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getPontuacaoColor(pontuacao: number): string {
    if (pontuacao === 100) return 'text-green-600 dark:text-green-400';
    if (pontuacao >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (pontuacao >= 70) return 'text-blue-600 dark:text-blue-400';
    if (pontuacao >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }

  function getPontuacaoBadge(pontuacao: number): string {
    if (pontuacao === 100)
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700';
    if (pontuacao >= 90)
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
    if (pontuacao >= 70)
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700';
    if (pontuacao >= 50)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700';
  }

  function getPontuacaoEmoji(pontuacao: number): string {
    if (pontuacao === 100) return '🏆';
    if (pontuacao >= 90) return '⭐';
    if (pontuacao >= 70) return '🎯';
    if (pontuacao >= 50) return '💪';
    return '📖';
  }

  function getPontuacaoLabel(pontuacao: number): string {
    if (pontuacao === 100) return 'PERFEITO!';
    if (pontuacao >= 90) return 'EXCELENTE';
    if (pontuacao >= 70) return 'MUITO BOM';
    if (pontuacao >= 50) return 'BOM';
    return 'PRECISA MELHORAR';
  }

  const historicoFiltrado = historico.filter((item) => {
    if (filtro === 'perfeitos') return item.desrePontuacao === 100;
    if (filtro === 'bons') return item.desrePontuacao >= 70 && item.desrePontuacao < 100;
    if (filtro === 'regulares') return item.desrePontuacao < 70;
    return true;
  });

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
                <BreadcrumbPage>Histórico</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header com animação */}
          <div className="mb-8 sm:mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex items-center gap-3 mb-3">
              <History className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Histórico de Desafios
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Acompanhe todo o seu progresso e desempenho nos desafios
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 animate-ping" />
              </div>
            </div>
          ) : error ? (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 animate-shake">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Estatísticas com animação em cascata */}
              {estatisticas && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  {[
                    {
                      icon: Trophy,
                      title: 'Perfeitos',
                      value: estatisticas.totalDesafiosCompletados,
                      subtitle: 'desafios 100%',
                      color: 'yellow',
                      delay: '0.1s',
                    },
                    {
                      icon: Target,
                      title: 'Total Tentativas',
                      value: estatisticas.totalTentativas,
                      subtitle: 'tentativas realizadas',
                      color: 'purple',
                      delay: '0.2s',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Média Geral',
                      value: `${estatisticas.mediaPontuacao.toFixed(1)}%`,
                      subtitle: 'pontuação média',
                      color: 'blue',
                      delay: '0.3s',
                    },
                    {
                      icon: Award,
                      title: 'Eficiência',
                      value: `${estatisticas.percentualEficiencia.toFixed(1)}%`,
                      subtitle: 'taxa de sucesso',
                      color: 'green',
                      delay: '0.4s',
                    },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                      yellow:
                        'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
                      purple:
                        'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
                      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
                      green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
                    };

                    return (
                      <Card
                        key={index}
                        className="opacity-0 animate-[slideUp_0.6s_ease-out_forwards] hover:scale-105 transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm"
                        style={{ animationDelay: stat.delay }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                colorClasses[stat.color as keyof typeof colorClasses]
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-base sm:text-lg dark:text-gray-200">
                              {stat.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl sm:text-3xl font-bold dark:text-white">
                            {stat.value}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {stat.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Filtros */}
              <div className="mb-6 opacity-0 animate-[slideUp_0.6s_ease-out_0.5s_forwards]">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Filtrar por desempenho:
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'todos', label: 'Todos', icon: '📊' },
                    { id: 'perfeitos', label: 'Perfeitos (100%)', icon: '🏆' },
                    { id: 'bons', label: 'Bons (≥70%)', icon: '🎯' },
                    { id: 'regulares', label: 'Regulares (<70%)', icon: '📖' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFiltro(f.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        filtro === f.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Histórico */}
              {historicoFiltrado.length === 0 ? (
                <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards] dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="pt-6 text-center py-12">
                    {filtro === 'todos' ? (
                      <>
                        <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-bounce" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                          Você ainda não completou nenhum desafio.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4">
                          Comece agora e acompanhe seu progresso!
                        </p>
                        <Link
                          href="/home/desafios"
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                          Ver Desafios Disponíveis
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                          Nenhum desafio encontrado com este filtro.
                        </p>
                        <button
                          onClick={() => setFiltro('todos')}
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                          Ver Todos os Desafios
                        </button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 opacity-0 animate-[slideUp_0.6s_ease-out_0.6s_forwards]">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Histórico Completo
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {historicoFiltrado.length}{' '}
                      {historicoFiltrado.length === 1 ? 'registro' : 'registros'}
                    </span>
                  </div>

                  {historicoFiltrado.map((item, index) => {
                    const isPerfect = item.desrePontuacao === 100;
                    return (
                      <Card
                        key={item.desreId}
                        className={`opacity-0 animate-[slideUp_0.4s_ease-out_forwards] hover:scale-[1.02] transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm overflow-hidden ${
                          isPerfect ? 'border-l-4 border-l-green-500' : ''
                        }`}
                        style={{ animationDelay: `${0.7 + 0.05 * index}s` }}
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-4">
                            {/* Header do card */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  {isPerfect && (
                                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse flex-shrink-0 mt-1" />
                                  )}
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {item.desafioTitulo}
                                  </h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDateTime(item.desreDatacadastro)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>
                                      {item.desreAcertos} de {item.desreTotalQuestoes} questões
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Badge de pontuação */}
                              <div className="flex flex-col items-start sm:items-end gap-2">
                                <div
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold border-2 ${getPontuacaoBadge(
                                    item.desrePontuacao,
                                  )}`}
                                >
                                  <span className="text-xl">
                                    {getPontuacaoEmoji(item.desrePontuacao)}
                                  </span>
                                  <span className="text-2xl">
                                    {item.desrePontuacao.toFixed(1)}%
                                  </span>
                                </div>
                                <span
                                  className={`text-xs font-semibold ${getPontuacaoColor(
                                    item.desrePontuacao,
                                  )}`}
                                >
                                  {getPontuacaoLabel(item.desrePontuacao)}
                                </span>
                              </div>
                            </div>

                            {/* Barra de progresso */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  item.desrePontuacao === 100
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    : item.desrePontuacao >= 70
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                      : item.desrePontuacao >= 50
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                                }`}
                                style={{
                                  width: `${item.desrePontuacao}%`,
                                  animation: `expandWidth 1s ease-out ${0.7 + 0.05 * index}s backwards`,
                                }}
                              />
                            </div>

                            {/* Botão de ação */}
                            <div className="flex justify-end">
                              <Link
                                href={`/home/desafios/${item.desafioId}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-sm font-medium text-gray-700 dark:text-gray-200 hover:scale-105"
                              >
                                Tentar Novamente
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
