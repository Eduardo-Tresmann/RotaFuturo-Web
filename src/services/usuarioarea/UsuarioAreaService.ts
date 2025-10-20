import { baseApiService } from '@/services/baseApiService';

export interface UsuarioArea {
  usuareaId: number;
  usuarioId: number;
  area: {
    areaId: number;
    areaDescricao: string;
  } | null;
  areaSub: {
    areasId: number;
    areasDescricao: string;
  } | null;
  usuareaDatacadastro: string;
  usuareaHoracadastro: string;
}

class UsuarioAreaService {
  /**
   * Lista as áreas e subáreas do usuário autenticado.
   */
  async listarMinhasAreas(): Promise<UsuarioArea[]> {
    return baseApiService.request<UsuarioArea[]>('/api/usuario-area/minhas-areas', {
      method: 'GET',
    });
  }

  /**
   * Vincula uma área e opcionalmente uma subárea ao usuário autenticado.
   */
  async vincularArea(areaId: number, areaSubId?: number): Promise<UsuarioArea> {
    return baseApiService.request<UsuarioArea>('/api/usuario-area/vincular', {
      method: 'POST',
      body: JSON.stringify({
        areaId,
        areaSubId: areaSubId || null,
      }),
    });
  }

  /**
   * Desvincula uma área específica do usuário.
   */
  async desvincularArea(usuareaId: number): Promise<void> {
    return baseApiService.request<void>(`/api/usuario-area/${usuareaId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Desvincula todas as áreas do usuário autenticado.
   */
  async desvincularTodasAreas(): Promise<void> {
    return baseApiService.request<void>('/api/usuario-area/todas', {
      method: 'DELETE',
    });
  }

  async vincularUsuarioArea(usuarioId: number, areaId: number): Promise<void> {
    await baseApiService.request(`/testequestaorespondida/vincular-area/${usuarioId}/${areaId}`, {
      method: 'POST',
    });
  }

  async vincularUsuarioSubarea(usuarioId: number, areaSubId: number): Promise<void> {
    throw new Error('Endpoint para vincular usuário à subárea ainda não implementado no backend');
  }
}

export const usuarioAreaService = new UsuarioAreaService();
