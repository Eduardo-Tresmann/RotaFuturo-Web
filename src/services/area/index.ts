import { Area } from '@/types/area';
import { baseApiService } from '@/services/baseApiService';
function adaptArea(area: any): Area {
  if (!area) return area;
  return {
    ...area,
    id: area.id || area.areaId || 0,
    ativo: area.ativo === undefined ? true : area.ativo,
    descricao: area.descricao || area.areaDescricao || '',
    dataCadastro: area.dataCadastro || area.areaDatacadastro || '',
    horaCadastro: area.horaCadastro || area.areaHoracadastro || '',
    areaId: area.id || area.areaId || 0,
    areaDescricao: area.descricao || area.areaDescricao || '',
    areaAtivo: area.ativo === undefined ? true : area.ativo,
    areaDatacadastro: area.dataCadastro || area.areaDatacadastro || '',
    areaHoracadastro: area.horaCadastro || area.areaHoracadastro || '',
  };
}
export const areaService = {
  async listAll(): Promise<Area[]> {
    try {
      const areas = await baseApiService.request<any[]>('/area');
      return areas.map(adaptArea);
    } catch (error) {
      console.error('Erro ao buscar áreas, usando dados mock:', error);
      const mockAreas = [
        {
          id: 1,
          descricao: 'Tecnologia da Informação',
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:00:00',
        },
        {
          id: 2,
          descricao: 'Administração',
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:05:00',
        },
        {
          id: 3,
          descricao: 'Saúde',
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:10:00',
        },
        {
          id: 4,
          descricao: 'Educação',
          ativo: true,
          dataCadastro: '2025-09-01',
          horaCadastro: '10:15:00',
        },
      ];
      return mockAreas.map(adaptArea);
    }
  },
  async create(data: Partial<Area>): Promise<Area> {
    const response = await baseApiService.request<any>('/area', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return adaptArea(response);
  },
  async update(id: number, data: Partial<Area>): Promise<Area> {
    const response = await baseApiService.request<any>(`/area/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return adaptArea(response);
  },
  async inativar(id: number): Promise<Area> {
    const response = await baseApiService.request<any>(`/area/${id}/inativar`, {
      method: 'PATCH',
    });
    return adaptArea(response);
  },
  async ativar(id: number): Promise<Area> {
    const response = await baseApiService.request<any>(`/area/${id}/ativar`, {
      method: 'PATCH',
    });
    return adaptArea(response);
  },
  async search(query: string): Promise<Area[]> {
    const areas = await baseApiService.request<any[]>(`/area?search=${encodeURIComponent(query)}`);
    return areas.map(adaptArea);
  },
};
