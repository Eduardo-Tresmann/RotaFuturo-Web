import { baseApiService } from '@/services/baseApiService';

export interface TipoQuestionario {
  id: number;
  descricao: string;
  ativo: boolean;
}

export const questionarioTipoService = {
  async listAll(): Promise<TipoQuestionario[]> {
    return baseApiService.request<TipoQuestionario[]>('/questionario-tipo');
  },
  async create(data: Partial<TipoQuestionario>): Promise<TipoQuestionario> {
    return baseApiService.request<TipoQuestionario>('/questionario-tipo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<TipoQuestionario>): Promise<TipoQuestionario> {
    return baseApiService.request<TipoQuestionario>(`/questionario-tipo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<TipoQuestionario> {
    return baseApiService.request<TipoQuestionario>(`/questionario-tipo/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
