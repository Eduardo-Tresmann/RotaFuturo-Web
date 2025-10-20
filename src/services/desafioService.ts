import { baseApiService } from './baseApiService';

export interface Nivel {
  nivId: number;
  nivDescricao: string;
}

export interface Area {
  areaId: number;
  areaDescricao: string;
}

export interface AreaSub {
  areasId: number;
  areasDescricao: string;
}

export interface Desafio {
  desId: number;
  desTitulo: string;
  desDescricao: string;
  desDatacadastro: string;
  desHoracadastro: string;
  nivel?: Nivel;
  area?: Area;
  areaSub?: AreaSub;
}

export interface DesafioCreateDTO {
  desTitulo: string;
  desDescricao: string;
  nivelId?: number;
  areaId?: number;
  areaSubId?: number;
}

export interface DesafioUpdateDTO {
  desTitulo?: string;
  desDescricao?: string;
  nivelId?: number;
  areaId?: number;
  areaSubId?: number;
}

class DesafioService {
  private readonly baseUrl = '/api/desafios';

  /**
   * Lista todos os desafios.
   */
  async listarTodos(): Promise<Desafio[]> {
    return baseApiService.request<Desafio[]>(this.baseUrl, {
      method: 'GET',
    });
  }

  /**
   * Lista desafios filtrados pelas áreas do usuário autenticado.
   */
  async listarDesafiosDoUsuario(): Promise<Desafio[]> {
    return baseApiService.request<Desafio[]>(`${this.baseUrl}/usuario`, {
      method: 'GET',
    });
  }

  /**
   * Busca um desafio por ID.
   */
  async buscarPorId(id: number): Promise<Desafio> {
    return baseApiService.request<Desafio>(`${this.baseUrl}/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Cria um novo desafio.
   */
  async criar(desafio: DesafioCreateDTO): Promise<Desafio> {
    return baseApiService.request<Desafio>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(desafio),
    });
  }

  /**
   * Atualiza um desafio existente.
   */
  async atualizar(id: number, desafio: DesafioUpdateDTO): Promise<Desafio> {
    return baseApiService.request<Desafio>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(desafio),
    });
  }

  /**
   * Remove um desafio.
   */
  async remover(id: number): Promise<void> {
    return baseApiService.request<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Busca o questionário vinculado ao desafio com suas questões.
   */
  async buscarQuestionarioDoDesafio(desafioId: number): Promise<QuestionarioComQuestoes> {
    return baseApiService.request<QuestionarioComQuestoes>(
      `${this.baseUrl}/${desafioId}/questionario`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Envia as respostas do usuário para um desafio e retorna a pontuação obtida.
   */
  async enviarRespostas(resposta: DesafioResposta): Promise<DesafioRealizado> {
    return baseApiService.request<DesafioRealizado>(
      `${this.baseUrl}/${resposta.desafioId}/respostas`,
      {
        method: 'POST',
        body: JSON.stringify(resposta),
      },
    );
  }

  /**
   * Busca o histórico de desafios realizados por um usuário.
   */
  async buscarHistoricoUsuario(usuarioId: number): Promise<DesafioRealizado[]> {
    try {
      return await baseApiService.request<DesafioRealizado[]>(
        `${this.baseUrl}/usuario/${usuarioId}/historico`,
        {
          method: 'GET',
        },
      );
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Busca o ranking de um desafio (top pontuações).
   */
  async buscarRankingDesafio(desafioId: number): Promise<DesafioRealizado[]> {
    return baseApiService.request<DesafioRealizado[]>(`${this.baseUrl}/${desafioId}/ranking`, {
      method: 'GET',
    });
  }

  /**
   * Busca estatísticas de desafios de um usuário.
   */
  async buscarEstatisticasUsuario(usuarioId: number): Promise<EstatisticasUsuario> {
    try {
      return await baseApiService.request<EstatisticasUsuario>(
        `${this.baseUrl}/usuario/${usuarioId}/estatisticas`,
        {
          method: 'GET',
        },
      );
    } catch (error: any) {
      if (error.status === 404) {
        // Retornar estatísticas vazias se usuário não tem dados ainda
        return {
          usuarioId: usuarioId,
          totalDesafiosCompletados: 0,
          totalTentativas: 0,
          mediaPontuacao: 0,
          melhorPontuacao: 0,
          percentualEficiencia: 0,
        };
      }
      throw error;
    }
  }

  /**
   * Verifica se usuário já realizou um desafio e retorna melhor pontuação.
   */
  async buscarMelhorPontuacao(
    desafioId: number,
    usuarioId: number,
  ): Promise<DesafioRealizado | null> {
    try {
      return await baseApiService.request<DesafioRealizado>(
        `${this.baseUrl}/${desafioId}/usuario/${usuarioId}/melhor-pontuacao`,
        {
          method: 'GET',
        },
      );
    } catch (error: any) {
      // Se retornar 404, usuário não realizou ainda
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Busca o ranking global (top usuários por desafios completados com 100%).
   */
  async buscarRankingGlobal(): Promise<RankingUsuario[]> {
    try {
      return await baseApiService.request<RankingUsuario[]>(`${this.baseUrl}/ranking-global`, {
        method: 'GET',
      });
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Busca o ranking por tentativas (top usuários por total de tentativas).
   */
  async buscarRankingPorTentativas(): Promise<RankingUsuario[]> {
    try {
      return await baseApiService.request<RankingUsuario[]>(`${this.baseUrl}/ranking-tentativas`, {
        method: 'GET',
      });
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Busca a posição do usuário no ranking global.
   */
  async buscarPosicaoRanking(usuarioId: number): Promise<RankingUsuario | null> {
    try {
      return await baseApiService.request<RankingUsuario>(
        `${this.baseUrl}/usuario/${usuarioId}/posicao-ranking`,
        {
          method: 'GET',
        },
      );
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Busca o progresso do usuário na carreira.
   */
  async buscarProgressoCarreira(usuarioId: number): Promise<ProgressoCarreira[]> {
    try {
      return await baseApiService.request<ProgressoCarreira[]>(
        `${this.baseUrl}/usuario/${usuarioId}/progresso`,
        {
          method: 'GET',
        },
      );
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  }
}

export interface Alternativa {
  quesaId: number;
  quesaDescricao: string;
  quesaCorreta: boolean;
}

export interface Questao {
  questaoId: number;
  questaoCodigo: string;
  questaoDescricao: string;
  questaoTipo: string;
  questaoExperiencia: number;
  alternativas: Alternativa[];
}

export interface QuestionarioComQuestoes {
  quesId: number;
  quesDescricao: string;
  quesPeso: number;
  questoes: Questao[];
}

export interface RespostaQuestao {
  questaoId: number;
  alternativaId: number;
}

export interface DesafioResposta {
  desafioId: number;
  usuarioId: number;
  respostas: RespostaQuestao[];
}

export interface DesafioRealizado {
  desreId: number;
  desafioId: number;
  desafioTitulo: string;
  usuarioId: number;
  desrePontuacao: number;
  desreAcertos: number;
  desreTotalQuestoes: number;
  desreDatacadastro: string;
  desreHoracadastro: string;
}

export interface EstatisticasUsuario {
  usuarioId: number;
  totalDesafiosCompletados: number; // Apenas desafios com 100% de acerto
  totalTentativas: number; // Todas as tentativas
  mediaPontuacao: number;
  melhorPontuacao: number;
  percentualEficiencia: number; // (desafiosPerfeitos / totalTentativas) * 100
}

export interface RankingUsuario {
  usuarioId: number;
  usuarioNome: string;
  totalDesafiosCompletados: number; // Apenas desafios com 100% de acerto
  totalTentativas: number; // Todas as tentativas
  mediaPontuacao: number;
  melhorPontuacao: number;
  percentualEficiencia: number; // (desafiosPerfeitos / totalTentativas) * 100
  posicao: number;
}

export interface ProgressoCarreira {
  areaId: number;
  areaDescricao: string;
  areaSubId?: number;
  areaSubDescricao?: string;
  totalDesafios: number;
  desafiosCompletados: number;
  percentualConcluido: number;
}

export const desafioService = new DesafioService();
