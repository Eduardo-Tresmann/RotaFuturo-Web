import { AreaSub } from '@/types/areasub';
import { baseApiService } from '@/services/baseApiService';
function adaptAreaSub(areaSub: any): AreaSub {
  if (!areaSub) return areaSub;
  return {
    ...areaSub,
    id: areaSub.id || areaSub.areasId || 0,
    areaId: areaSub.areaId || 0,
    ativo: areaSub.ativo === undefined ? true : areaSub.ativo,
    areasDescricao: areaSub.areasDescricao || '',
    dataCadastro: areaSub.dataCadastro || areaSub.areasDatacadastro || '',
    horaCadastro: areaSub.horaCadastro || areaSub.areasHoracadastro || '',
    areasId: areaSub.id || areaSub.areasId || 0,
    areasAtivo: areaSub.ativo === undefined ? true : areaSub.ativo,
    areasDatacadastro: areaSub.dataCadastro || areaSub.areasDatacadastro || '',
    areasHoracadastro: areaSub.horaCadastro || areaSub.areasHoracadastro || '',
  };
}
export const areaSubService = {
  async search(query: string): Promise<AreaSub[]> {
    const results = await baseApiService.request<any[]>(
      `/areasub?search=${encodeURIComponent(query)}`,
    );
    return results.map(adaptAreaSub);
  },
  async listAll(): Promise<AreaSub[]> {
    try {
      const results = await baseApiService.request<any[]>('/areasub');
      return results.map(adaptAreaSub);
    } catch (error) {
      console.error('Erro ao buscar subáreas, usando dados mock:', error);
      const mockAreaSubs = [
        {
          id: 1,
          areasDescricao: 'Desenvolvimento de Software',
          areaId: 1,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:00:00',
        },
        {
          id: 2,
          areasDescricao: 'Redes de Computadores',
          areaId: 1,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:05:00',
        },
        {
          id: 3,
          areasDescricao: 'Finanças',
          areaId: 2,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:10:00',
        },
        {
          id: 4,
          areasDescricao: 'Marketing',
          areaId: 2,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:15:00',
        },
        {
          id: 5,
          areasDescricao: 'Enfermagem',
          areaId: 3,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:20:00',
        },
        {
          id: 6,
          areasDescricao: 'Medicina',
          areaId: 3,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:25:00',
        },
        {
          id: 7,
          areasDescricao: 'Pedagogia',
          areaId: 4,
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:30:00',
        },
      ];
      return mockAreaSubs.map(adaptAreaSub);
    }
  },
  async create(data: Partial<AreaSub>): Promise<AreaSub> {
    const response = await baseApiService.request<any>('/areasub', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return adaptAreaSub(response);
  },
  async update(id: number, data: Partial<AreaSub>): Promise<AreaSub> {
    const response = await baseApiService.request<any>(`/areasub/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return adaptAreaSub(response);
  },
  async inativar(id: number): Promise<AreaSub> {
    const response = await baseApiService.request<any>(`/areasub/${id}/inativar`, {
      method: 'PATCH',
    });
    return adaptAreaSub(response);
  },
  async ativar(id: number): Promise<AreaSub> {
    const response = await baseApiService.request<any>(`/areasub/${id}/ativar`, {
      method: 'PATCH',
    });
    return adaptAreaSub(response);
  },
};
