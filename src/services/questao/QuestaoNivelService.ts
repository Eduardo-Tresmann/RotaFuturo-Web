import { baseApiService } from '@/services/baseApiService';

export interface NivelQuestao {
  quesnId?: number;
  quesnDescricao: string;
  quesnAtivo?: boolean;
}

export const questaoNivelService = {
  async listAll(): Promise<NivelQuestao[]> {
    return baseApiService.request<NivelQuestao[]>('/questao-nivel');
  },
  async create(data: Partial<NivelQuestao>): Promise<NivelQuestao> {
    const payload = {
      quesnDescricao: data.quesnDescricao,
      quesnAtivo: data.quesnAtivo ?? true,
    };
    return baseApiService.request<NivelQuestao>('/questao-nivel', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async update(id: number, data: Partial<NivelQuestao>): Promise<NivelQuestao> {
    const payload = {
      quesnDescricao: data.quesnDescricao,
      quesnAtivo: data.quesnAtivo ?? true,
    };
    return baseApiService.request<NivelQuestao>(`/questao-nivel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async inativar(id: number): Promise<NivelQuestao> {
    return baseApiService.request<NivelQuestao>(`/questao-nivel/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
