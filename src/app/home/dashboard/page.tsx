'use client';

import React, { useEffect, useState } from 'react';
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
import { RankingGlobalXp } from '../components/RankingGlobalXp';
import {
  desafioService,
  EstatisticasUsuario,
  RankingUsuario,
  ProgressoCarreira,
  Desafio,
  DesafioRealizado,
} from '@/services/desafioService';
import {
  Loader2,
  Trophy,
  TrendingUp,
  Award,
  Medal,
  TrendingDown,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuthContext } from '@/components/context/AuthContext';

export default function PaginaDashboard() {
  const { usuario } = useAuthContext();
  const [estatisticas, setEstatisticas] = useState<EstatisticasUsuario | null>(null);
  const [rankingGlobal, setRankingGlobal] = useState<RankingUsuario[]>([]);
  const [rankingTentativas, setRankingTentativas] = useState<RankingUsuario[]>([]);
  const [posicaoUsuario, setPosicaoUsuario] = useState<RankingUsuario | null>(null);
  const [progressoCarreira, setProgressoCarreira] = useState<ProgressoCarreira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario) {
      loadData();
    }
  }, [usuario]);

  async function loadData() {
    if (!usuario) return;

    try {
      setLoading(true);
      const [
        estatisticasData,
        rankingData,
        rankingTentativasData,
        posicaoData,
        progressoData,
        historicoData,
        todosDesafiosData,
      ] = await Promise.all([
        desafioService.buscarEstatisticasUsuario(usuario.usuId),
        desafioService.buscarRankingGlobal(),
        desafioService.buscarRankingPorTentativas(),
        desafioService.buscarPosicaoRanking(usuario.usuId),
        desafioService.buscarProgressoCarreira(usuario.usuId),
        desafioService.buscarHistoricoUsuario(usuario.usuId),
        desafioService.listarTodos(),
      ]);

      setEstatisticas(estatisticasData);
      setRankingGlobal(rankingData);
      setRankingTentativas(rankingTentativasData);
      setPosicaoUsuario(posicaoData);

      // Calcular progresso em TODAS as áreas onde o usuário realizou desafios
      const progressoPorArea = calcularProgressoTodasAreas(
        historicoData,
        todosDesafiosData,
        progressoData,
      );
      setProgressoCarreira(progressoPorArea);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function calcularProgressoTodasAreas(
    historico: any[],
    todosDesafios: any[],
    progressoOriginal: ProgressoCarreira[],
  ): ProgressoCarreira[] {
    // Criar mapa de desafios realizados por área
    const desafiosRealizadosPorArea = new Map<string, Set<number>>();

    historico.forEach((item) => {
      const desafio = todosDesafios.find((d) => d.desId === item.desafioId);
      if (desafio && desafio.area) {
        const chave = desafio.areaSub
          ? `${desafio.area.areaId}-${desafio.areaSub.areasId}`
          : `${desafio.area.areaId}`;

        if (!desafiosRealizadosPorArea.has(chave)) {
          desafiosRealizadosPorArea.set(chave, new Set());
        }
        desafiosRealizadosPorArea.get(chave)!.add(item.desafioId);
      }
    });

    // Criar mapa de total de desafios por área
    const totalDesafiosPorArea = new Map<string, { area: any; areaSub: any; total: number }>();

    todosDesafios.forEach((desafio) => {
      if (desafio.area) {
        const chave = desafio.areaSub
          ? `${desafio.area.areaId}-${desafio.areaSub.areasId}`
          : `${desafio.area.areaId}`;

        if (!totalDesafiosPorArea.has(chave)) {
          totalDesafiosPorArea.set(chave, {
            area: desafio.area,
            areaSub: desafio.areaSub,
            total: 0,
          });
        }
        totalDesafiosPorArea.get(chave)!.total++;
      }
    });

    // Criar array de progresso apenas para áreas onde o usuário realizou desafios
    const progressoCompleto: ProgressoCarreira[] = [];

    desafiosRealizadosPorArea.forEach((desafiosRealizados, chave) => {
      const info = totalDesafiosPorArea.get(chave);
      if (info) {
        const desafiosCompletados = desafiosRealizados.size;
        const totalDesafios = info.total;
        const percentualConcluido = (desafiosCompletados / totalDesafios) * 100;

        progressoCompleto.push({
          areaId: info.area.areaId,
          areaDescricao: info.area.areaDescricao,
          areaSubId: info.areaSub?.areasId,
          areaSubDescricao: info.areaSub?.areasDescricao,
          totalDesafios,
          desafiosCompletados,
          percentualConcluido,
        });
      }
    });

    // Ordenar por percentual concluído (decrescente)
    return progressoCompleto.sort((a, b) => b.percentualConcluido - a.percentualConcluido);
  }

  function getMedalIcon(posicao: number) {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return posicao;
  }

  function getProgressColor(percentual: number): string {
    if (percentual >= 90) return 'bg-green-500 dark:bg-green-600';
    if (percentual >= 70) return 'bg-blue-500 dark:bg-blue-600';
    if (percentual >= 50) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  }

  function getProgressTextColor(percentual: number): string {
    if (percentual >= 90) return 'text-green-600 dark:text-green-400';
    if (percentual >= 70) return 'text-blue-600 dark:text-blue-400';
    if (percentual >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
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
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Acompanhe seu desempenho, rankings e progresso na carreira
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
                      title: 'Completados 100%',
                      value: estatisticas.totalDesafiosCompletados,
                      subtitle: 'desafios perfeitos',
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

              {/* Ranking Global de XP */}
              <div className="mb-8 sm:mb-12 opacity-0 animate-[fadeIn_0.8s_ease-out_0.45s_forwards]">
                <RankingGlobalXp />
              </div>

              {/* Rankings lado a lado em desktop, empilhados em mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {/* Ranking Global - Desafios Perfeitos */}
                <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards] dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                        <CardTitle className="text-lg sm:text-xl dark:text-gray-200">
                          🏆 Desafios Perfeitos
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Top usuários com 100% de acerto
                    </p>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto">
                    {rankingGlobal.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8 text-sm">
                        Nenhum ranking disponível ainda.
                      </p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {rankingGlobal.map((ranking, idx) => (
                          <div
                            key={ranking.usuarioId}
                            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                              ranking.usuarioId === usuario?.usuId
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700'
                                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                            style={{
                              animation: `slideInLeft 0.4s ease-out ${0.1 * idx}s backwards`,
                            }}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-8 sm:w-10 text-center font-bold text-base sm:text-lg flex-shrink-0">
                                {getMedalIcon(ranking.posicao)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                                  {ranking.usuarioNome}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {ranking.totalDesafiosCompletados} perfeitos |{' '}
                                  {ranking.totalTentativas} tentativas
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-base sm:text-lg text-green-600 dark:text-green-400">
                                {ranking.percentualEficiencia.toFixed(1)}%
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">eficiência</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ranking por Tentativas */}
                <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards] dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                        <CardTitle className="text-lg sm:text-xl dark:text-gray-200">
                          ⚡ Tentativas
                        </CardTitle>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Top usuários mais persistentes
                    </p>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto">
                    {rankingTentativas.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8 text-sm">
                        Nenhum ranking disponível ainda.
                      </p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {rankingTentativas.map((ranking, idx) => (
                          <div
                            key={ranking.usuarioId}
                            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                              ranking.usuarioId === usuario?.usuId
                                ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700'
                                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                            style={{
                              animation: `slideInRight 0.4s ease-out ${0.1 * idx}s backwards`,
                            }}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-8 sm:w-10 text-center font-bold text-base sm:text-lg flex-shrink-0">
                                {getMedalIcon(ranking.posicao)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                                  {ranking.usuarioNome}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {ranking.totalDesafiosCompletados} perfeitos |{' '}
                                  {ranking.totalTentativas} tentativas
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-base sm:text-lg text-orange-600 dark:text-orange-400">
                                {ranking.totalTentativas}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Média: {ranking.mediaPontuacao.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Posição Pessoal */}
              <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.7s_forwards] mb-8 sm:mb-12 dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-lg sm:text-xl dark:text-gray-200">
                      📊 Sua Posição no Ranking
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {!posicaoUsuario ? (
                    <div className="text-center py-8 sm:py-12">
                      <TrendingDown className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-bounce" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                        Você ainda não aparece no ranking.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Complete desafios com 100% para entrar no ranking!
                      </p>
                      <Link
                        href="/home/desafios"
                        className="inline-flex items-center gap-2 mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                      >
                        Ver Desafios
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-4 sm:p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Sua Posição
                            </p>
                            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-600 dark:text-purple-400">
                              #{posicaoUsuario.posicao}
                            </p>
                          </div>
                          <div className="text-5xl sm:text-6xl animate-bounce">
                            {posicaoUsuario.posicao <= 3
                              ? getMedalIcon(posicaoUsuario.posicao)
                              : '🎯'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                          <div className="bg-white/50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Desafios Perfeitos
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                              {posicaoUsuario.totalDesafiosCompletados}
                            </p>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Total Tentativas
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                              {posicaoUsuario.totalTentativas}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Média de Pontuação
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {posicaoUsuario.mediaPontuacao.toFixed(1)}%
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 hover:scale-105 transition-transform duration-300">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Eficiência
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                            {posicaoUsuario.percentualEficiencia.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progresso na Carreira */}
              {progressoCarreira.length > 0 && (
                <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards] dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                      <CardTitle className="text-lg sm:text-xl dark:text-gray-200">
                        📈 Progresso na Carreira
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      {progressoCarreira.map((progresso, index) => (
                        <div
                          key={index}
                          className="space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300"
                          style={{
                            animation: `slideUp 0.5s ease-out ${0.1 * index}s backwards`,
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                {progresso.areaDescricao}
                                {progresso.areaSubDescricao && ` - ${progresso.areaSubDescricao}`}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {progresso.desafiosCompletados} de {progresso.totalDesafios}{' '}
                                desafios completados
                              </p>
                            </div>
                            <p
                              className={`text-lg sm:text-xl font-bold ${getProgressTextColor(
                                progresso.percentualConcluido,
                              )}`}
                            >
                              {progresso.percentualConcluido.toFixed(1)}%
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(
                                progresso.percentualConcluido,
                              )} transition-all duration-1000 ease-out`}
                              style={{
                                width: `${progresso.percentualConcluido}%`,
                                animation: `expandWidth 1.5s ease-out ${0.2 * index}s backwards`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {progressoCarreira.length === 0 && (
                <Card className="opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards] dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="pt-6 text-center py-12">
                    <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                      Você ainda não possui progresso em nenhuma carreira.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                      Complete desafios para acompanhar seu progresso!
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
