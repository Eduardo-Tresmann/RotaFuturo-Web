import { baseApiService } from '@/services/baseApiService';

export interface Teste {
  tesId: number;
  tesDescricao: string;
  areaId?: number;
  areaSubId?: number;
}

export interface TesteQuestao {
  tesqId: number;
  tesqDescricao: string;
  areaId?: number;
  areaSubId?: number;
  testeId?: number;
  testeDescricao?: string;
}

export const testeService = {
  async listTestes(): Promise<Teste[]> {
    return baseApiService.request<Teste[]>('/teste');
  },
  async listQuestoes(testeId: number): Promise<TesteQuestao[]> {
    return baseApiService.request<TesteQuestao[]>(`/teste/${testeId}/questoes`);
  },
  async responderQuestao(vinculoId: number, resposta: number, usuarioId: number) {
    return baseApiService.request(`/testequestaorespondida`, {
      method: 'POST',
      body: JSON.stringify({ tesqvId: vinculoId, tesqrResposta: resposta, usuId: usuarioId }),
    });
  },
  async createTeste(data: Partial<Teste>) {
    return baseApiService.request('/teste', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateTeste(tesId: number, data: Partial<Teste>) {
    return baseApiService.request(`/teste/${tesId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async createTesteQuestao(data: Partial<TesteQuestao>): Promise<TesteQuestao> {
    return baseApiService.request<TesteQuestao>('/testequestao', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateTesteQuestao(tesqId: number, data: Partial<TesteQuestao>) {
    return baseApiService.request(`/testequestao/${tesqId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
