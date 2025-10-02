import { Questionario } from '@/types/questionario';
import { baseApiService } from '@/services/baseApiService';
export const questionarioService = {
  async listAll(): Promise<Questionario[]> {
    return baseApiService.request<Questionario[]>('/questionario');
  },
  async create(data: Partial<Questionario>): Promise<Questionario> {
    return baseApiService.request<Questionario>('/questionario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Questionario>): Promise<Questionario> {
    return baseApiService.request<Questionario>(`/questionario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Questionario> {
    return baseApiService.request<Questionario>(`/questionario/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
