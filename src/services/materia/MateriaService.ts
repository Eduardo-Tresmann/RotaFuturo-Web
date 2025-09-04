import { Materia } from '@/types/materia';
import { baseApiService } from '@/services/baseApiService';

export const materiaService = {
  async listAll(): Promise<Materia[]> {
    return baseApiService.request<Materia[]>('/materia');
  },
  async create(data: Partial<Materia>): Promise<Materia> {
    return baseApiService.request<Materia>('/materia', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Materia>): Promise<Materia> {
    return baseApiService.request<Materia>(`/materia/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Materia> {
    return baseApiService.request<Materia>(`/materia/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
