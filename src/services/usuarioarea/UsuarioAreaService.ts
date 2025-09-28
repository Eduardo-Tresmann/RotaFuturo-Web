import { baseApiService } from '@/services/baseApiService';

/**
 * Serviço para gerenciar vinculações entre usuários e áreas/subáreas
 */
class UsuarioAreaService {
  /**
   * Vincula um usuário a uma área
   */
  async vincularUsuarioArea(usuarioId: number, areaId: number): Promise<void> {
    await baseApiService.request(`/testequestaorespondida/vincular-area/${usuarioId}/${areaId}`, {
      method: 'POST',
    });
  }

  /**
   * Vincula um usuário a uma subárea
   *
   * NOTA: Este endpoint ainda não existe no backend (erro 404)
   * Precisará ser implementado no backend antes de usar esta função
   *
   * @todo Verificar implementação no backend e ajustar o endpoint conforme necessário
   */
  async vincularUsuarioSubarea(usuarioId: number, areaSubId: number): Promise<void> {
    // AVISO: Endpoint não implementado no backend (retorna 404)
    // Manter comentado até que o endpoint seja implementado no backend
    throw new Error('Endpoint para vincular usuário à subárea ainda não implementado no backend');

    // Código original:
    // await baseApiService.request(
    //   `/testequestaorespondida/vincular-areasub/${usuarioId}/${areaSubId}`,
    //   {
    //     method: 'POST',
    //   },
    // );
  }
}

export const usuarioAreaService = new UsuarioAreaService();
