'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
import { useAuthContext } from '@/components/context/AuthContext';
import { desafioService, Desafio, DesafioRealizado } from '@/services/desafioService';
import { Loader2, CheckCircle, History, Target, Play, Star, Sparkles, Lock } from 'lucide-react';

export default function DesafiosPage() {
  const { authResolved, usuario } = useAuthContext();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [desafiosRealizados, setDesafiosRealizados] = useState<Map<number, DesafioRealizado>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authResolved && usuario) {
      loadDesafios();
    }
  }, [authResolved, usuario]);

  async function loadDesafios() {
    if (!usuario) return;

    try {
      setLoading(true);
      const [desafiosData, historicoData] = await Promise.all([
        desafioService.listarDesafiosDoUsuario(),
        desafioService.buscarHistoricoUsuario(usuario.usuId),
      ]);

      setDesafios(desafiosData);

      // Cria um mapa de desafioId -> melhor pontuação
      const realizadosMap = new Map<number, DesafioRealizado>();
      historicoData.forEach((item) => {
        const existing = realizadosMap.get(item.desafioId);
        if (!existing || item.desrePontuacao > existing.desrePontuacao) {
          realizadosMap.set(item.desafioId, item);
        }
      });

      setDesafiosRealizados(realizadosMap);
    } catch (err: any) {
      console.error('Erro ao carregar desafios:', err);
      setError('Não foi possível carregar os desafios. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  function getPontuacaoBadge(pontuacao: number): { bg: string; text: string; icon: string } {
    if (pontuacao >= 90)
      return { bg: 'bg-green-500 dark:bg-green-600', text: 'text-white', icon: '🎯' };
    if (pontuacao >= 70)
      return { bg: 'bg-blue-500 dark:bg-blue-600', text: 'text-white', icon: '⭐' };
    if (pontuacao >= 50)
      return { bg: 'bg-yellow-500 dark:bg-yellow-600', text: 'text-white', icon: '✨' };
    return { bg: 'bg-red-500 dark:bg-red-600', text: 'text-white', icon: '💪' };
  }

  function getNivelColor(nivel: string | undefined): string {
    switch (nivel?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'médio':
      case 'medio':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'difícil':
      case 'dificil':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
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
                <BreadcrumbPage>Desafios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400 animate-pulse" />
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Desafios
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Teste suas habilidades e conquiste o ranking
                </p>
              </div>
            </div>
            <Link
              href="/home/desafios/historico"
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              Meu Histórico
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-16 sm:py-24">
              <div className="relative">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-purple-600 dark:text-purple-400" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-purple-200 dark:border-purple-800 animate-ping" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 animate-shake">
              {error}
            </div>
          )}

          {!loading && !error && desafios.length === 0 && (
            <div className="text-center py-16 sm:py-24">
              <Target className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-bounce" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhum desafio disponível no momento.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {desafios.map((desafio, index) => {
              const realizado = desafiosRealizados.get(desafio.desId);
              const badge = realizado ? getPontuacaoBadge(realizado.desrePontuacao) : null;
              const isPerfect = realizado && realizado.desrePontuacao === 100;

              // Sistema de desbloqueio progressivo
              const desafioAnterior = index > 0 ? desafios[index - 1] : null;
              const anteriorRealizado = desafioAnterior
                ? desafiosRealizados.get(desafioAnterior.desId)
                : true;
              const isBloqueado = index > 0 && !anteriorRealizado;

              const cardClasses = `relative overflow-hidden border-2 shadow-md transition-all duration-300 ${
                isBloqueado
                  ? 'border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800/30'
                  : isPerfect
                  ? 'border-green-400 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
                  : realizado
                  ? 'border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
              } group`;

              const cardContent = (
                <Card className={cardClasses}>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 opacity-5 dark:opacity-10 transform rotate-12 translate-x-8 -translate-y-8">
                    <span className="text-9xl sm:text-[200px] font-extrabold">{index + 1}</span>
                  </div>

                  {/* Área badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 rounded-lg bg-yellow-400 dark:bg-yellow-500 text-black text-xs sm:text-sm font-semibold shadow-md group-hover:scale-110 transition-transform duration-300">
                    {desafio.area?.areaDescricao || 'GERAL'}
                  </div>

                  {/* Badge de Pontuação */}
                  {realizado && badge && !isBloqueado && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                      {isPerfect && (
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                      )}
                      <div
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg ${badge.bg} ${badge.text} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{realizado.desrePontuacao.toFixed(0)}%</span>
                        <span>{badge.icon}</span>
                      </div>
                    </div>
                  )}

                  {!realizado && !isBloqueado && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Novo</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pt-12 sm:pt-14 pb-2 sm:pb-3">
                    <CardTitle
                      className={`text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300 ${
                        isBloqueado
                          ? 'text-gray-500 dark:text-gray-600'
                          : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                      }`}
                    >
                      {desafio.desTitulo}
                    </CardTitle>
                    <CardDescription
                      className={`text-xs sm:text-sm line-clamp-2 ${
                        isBloqueado
                          ? 'text-gray-400 dark:text-gray-600'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {desafio.desDescricao}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2 pb-3 sm:pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {/* Avatar da área */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md group-hover:scale-110 transition-transform duration-300 ${
                          isBloqueado
                            ? 'from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700'
                            : 'from-purple-400 to-blue-500 dark:from-purple-600 dark:to-blue-700'
                        }`}
                      >
                        {desafio.area?.areaDescricao?.charAt(0) || 'D'}
                      </div>

                      {/* Nível */}
                      <span
                        className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-lg ${
                          isBloqueado
                            ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                            : getNivelColor(desafio.nivel?.nivDescricao)
                        }`}
                      >
                        {desafio.nivel?.nivDescricao || 'Nível não definido'}
                      </span>
                    </div>

                    {realizado && !isBloqueado && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          {realizado.desreAcertos}/{realizado.desreTotalQuestoes} acertos
                        </span>
                        {isPerfect && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Perfeito!
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>

                  {/* Hover indicator */}
                  {!isBloqueado && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Card>
              );

              return (
                <div
                  key={desafio.desId}
                  className="relative opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {isBloqueado ? (
                    <div className="relative cursor-not-allowed">
                      {cardContent}
                      {/* Overlay de bloqueio - Compacto e elegante */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 dark:from-gray-950/90 dark:via-gray-900/90 dark:to-gray-950/90 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-xl">
                        <div className="text-center px-6 py-4">
                          {/* Ícone com glow */}
                          <div className="relative inline-block mb-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center shadow-2xl">
                              <Lock className="w-8 h-8 text-gray-300 dark:text-gray-400" />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gray-500 dark:bg-gray-600 opacity-20 animate-ping" />
                          </div>

                          {/* Texto compacto */}
                          <h3 className="text-lg font-bold text-white mb-2">
                            🔒 Desafio Bloqueado
                          </h3>
                          <p className="text-sm text-gray-300 dark:text-gray-400 mb-3 max-w-md">
                            Complete o desafio anterior para desbloquear
                          </p>

                          {/* Badge do desafio anterior */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10">
                            <Target className="w-4 h-4 text-purple-400 dark:text-purple-300" />
                            <span className="text-xs font-medium text-gray-200 dark:text-gray-300 line-clamp-1">
                              {desafioAnterior?.desTitulo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={`/home/desafios/${desafio.desId}`}>{cardContent}</Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
