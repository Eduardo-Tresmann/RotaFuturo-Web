import { Questao } from '@/types/questao';
import { baseApiService } from '@/services/baseApiService';
export const questaoService = {
  async listAll(): Promise<Questao[]> {
    return baseApiService.request<Questao[]>('/questao');
  },
  async create(data: Partial<Questao>): Promise<Questao> {
    return baseApiService.request<Questao>('/questao', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Questao>): Promise<Questao> {
    return baseApiService.request<Questao>(`/questao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Questao> {
    return baseApiService.request<Questao>(`/questao/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
