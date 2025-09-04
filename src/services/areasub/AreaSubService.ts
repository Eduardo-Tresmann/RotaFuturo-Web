import { AreaSub } from '@/types/areasub';
import { baseApiService } from '@/services/baseApiService';

export const areaSubService = {
  async search(query: string): Promise<AreaSub[]> {
    return baseApiService.request<AreaSub[]>(`/areasub?search=${encodeURIComponent(query)}`);
  },
  async listAll(): Promise<AreaSub[]> {
    return baseApiService.request<AreaSub[]>('/areasub');
  },
  async create(data: Partial<AreaSub>): Promise<AreaSub> {
    return baseApiService.request<AreaSub>('/areasub', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id: number, data: Partial<AreaSub>): Promise<AreaSub> {
    return baseApiService.request<AreaSub>(`/areasub/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async inativar(id: number): Promise<AreaSub> {
    return baseApiService.request<AreaSub>(`/areasub/${id}/inativar`, {
      method: 'PATCH',
    });
  },
};
