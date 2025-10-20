'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Zap, Star, Crown } from 'lucide-react';
import { nivelXpService, RankingUsuarioXp } from '@/services/nivelxp/NivelXpService';
import { getFileName } from '@/lib/utils';

declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

export function RankingGlobalXp() {
  const [ranking, setRanking] = useState<RankingUsuarioXp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarRanking() {
      try {
        const dados = await nivelXpService.obterRankingGlobal(10);
        setRanking(dados);
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarRanking();
  }, []);

  const getPosicaoIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getPosicaoClass = (index: number) => {
    if (index === 0)
      return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
    if (index === 1)
      return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800';
    if (index === 2)
      return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            Ranking Global de XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ranking.length === 0) {
    return (
      <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            Ranking Global de XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Ainda não há usuários com XP registrado.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          Ranking Global de XP
          <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
            Top 10
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ranking.map((usuario, index) => (
            <div
              key={usuario.pessoaId}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${getPosicaoClass(
                index,
              )}`}
            >
              {/* Posição */}
              <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                {getPosicaoIcon(index) || (
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-white dark:border-gray-700 shadow-md">
                  {usuario.imagemPerfil && usuario.imagemPerfil.startsWith('storage/') ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                        usuario.usuarioId
                      }/${getFileName(usuario.imagemPerfil)}`}
                      alt={usuario.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Se a imagem falhar, mostrar inicial
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const div = document.createElement('div');
                          div.className =
                            'w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold';
                          div.textContent = usuario.nome.charAt(0).toUpperCase();
                          target.parentElement.appendChild(div);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Badge de nível */}
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  {usuario.nivel}
                </div>
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {usuario.nome}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  @{usuario.apelido}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {usuario.xp.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {usuario.questoesCorretas} questões
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
