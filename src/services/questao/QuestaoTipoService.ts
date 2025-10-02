import { baseApiService } from '@/services/baseApiService';
export interface TipoQuestao {
  quetId?: number;
  quetDescricao: string;
  quetAtivo?: boolean;
}
export const questaoTipoService = {
  async listAll(): Promise<TipoQuestao[]> {
    return baseApiService.request<TipoQuestao[]>('/questao-tipo');
  },
  async create(data: Partial<TipoQuestao>): Promise<TipoQuestao> {
    const payload = {
      quetDescricao: data.quetDescricao,
      quetAtivo: data.quetAtivo ?? true,
    };
    return baseApiService.request<TipoQuestao>('/questao-tipo', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async update(id: number, data: Partial<TipoQuestao>): Promise<TipoQuestao> {
    const payload = {
      quetDescricao: data.quetDescricao,
      quetAtivo: data.quetAtivo ?? true,
    };
    return baseApiService.request<TipoQuestao>(`/questao-tipo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async inativar(id: number): Promise<TipoQuestao> {
    return baseApiService.request<TipoQuestao>(`/questao-tipo/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
