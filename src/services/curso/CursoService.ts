import { Curso } from '@/types/curso';
import { baseApiService } from '@/services/baseApiService';
export const cursoService = {
  async listAll(): Promise<Curso[]> {
    return baseApiService.request<Curso[]>('/curso');
  },
  async create(data: Partial<Curso>): Promise<Curso> {
    return baseApiService.request<Curso>('/curso', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Curso>): Promise<Curso> {
    return baseApiService.request<Curso>(`/curso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Curso> {
    return baseApiService.request<Curso>(`/curso/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
