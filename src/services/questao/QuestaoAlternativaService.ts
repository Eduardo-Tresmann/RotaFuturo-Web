import { baseApiService } from '@/services/baseApiService';

export interface Alternativa {
  quesaId: number;
  quesaDescricao: string;
  quesaCorreta: number;
  questao: { questaoId: number };
}

export const questaoAlternativaService = {
  async listAll(): Promise<Alternativa[]> {
    return baseApiService.request<Alternativa[]>('/questao-alternativa');
  },
  async create(data: Partial<Alternativa>): Promise<Alternativa> {
    return baseApiService.request<Alternativa>('/questao-alternativa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Alternativa>): Promise<Alternativa> {
    return baseApiService.request<Alternativa>(`/questao-alternativa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Alternativa> {
    return baseApiService.request<Alternativa>(`/questao-alternativa/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
