import { baseApiService } from '@/services/baseApiService';
class UsuarioAreaService {
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
