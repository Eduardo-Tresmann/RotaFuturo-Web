import { baseApiService } from '@/services/baseApiService';

export interface RankingUsuarioXp {
  pessoaId: number;
  usuarioId: number;
  nome: string;
  apelido: string;
  nivel: number;
  xp: number;
  questoesCorretas: number;
  imagemPerfil: string | null;
}

export const nivelXpService = {
  /**
   * Obtém o ranking global de usuários por XP
   * @param limite Número de usuários no ranking (padrão: 10)
   */
  async obterRankingGlobal(limite: number = 10): Promise<RankingUsuarioXp[]> {
    return baseApiService.request<RankingUsuarioXp[]>(`/nivelxp/ranking?limite=${limite}`);
  },

  /**
   * Obtém informações de XP e nível de um usuário específico
   * @param usuarioId ID do usuário
   */
  async obterInfoUsuario(usuarioId: number) {
    return baseApiService.request(`/nivelxp/usuario/${usuarioId}`);
  },
};
