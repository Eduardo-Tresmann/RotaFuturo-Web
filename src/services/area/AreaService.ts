import { Area } from '@/types/area';
import { baseApiService } from '@/services/baseApiService';

export const areaService = {
  async listAll(): Promise<Area[]> {
    return baseApiService.request<Area[]>('/area');
  },
  async create(data: Partial<Area>): Promise<Area> {
    return baseApiService.request<Area>('/area', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<Area>): Promise<Area> {
    return baseApiService.request<Area>(`/area/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<Area> {
    return baseApiService.request<Area>(`/area/${id}/inativar`, {
      method: 'PATCH',
    });
  },
  async search(query: string): Promise<Area[]> {
    return baseApiService.request<Area[]>(`/area?search=${encodeURIComponent(query)}`);
  },
};
