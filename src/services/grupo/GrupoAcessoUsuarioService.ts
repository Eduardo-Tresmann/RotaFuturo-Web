import { baseApiService } from '@/services/baseApiService';
import { GrupoAcessoUsuario } from '@/types/grupo';
class GrupoAcessoUsuarioService {
  async listarGruposDoUsuario(usuarioId: number): Promise<string[]> {
    return baseApiService.request<string[]>(`/grupo-acesso-usuario/usuario/${usuarioId}/grupos`);
  }
  async verificarUsuarioNoGrupo(usuarioId: number, grupoDescricao: string): Promise<boolean> {
    return baseApiService.request<boolean>(
      `/grupo-acesso-usuario/verificar/${usuarioId}/${grupoDescricao}`,
    );
  }
  async associarUsuarioAGrupo(usuarioId: number, grupoId: number): Promise<GrupoAcessoUsuario> {
    return baseApiService.request<GrupoAcessoUsuario>(
      `/grupo-acesso-usuario/associar/${usuarioId}/${grupoId}`,
    );
  }
  async removerUsuarioDoGrupo(usuarioId: number, grupoId: number): Promise<void> {
    await baseApiService.request(`/grupo-acesso-usuario/remover/${usuarioId}/${grupoId}`, {
      method: 'DELETE',
    });
  }
  async inicializarGrupos(): Promise<string> {
    return baseApiService.request<string>('/setup/init-grupos', {
      method: 'POST',
    });
  }
  async associarAdmin(usuarioId: number): Promise<string> {
    return baseApiService.request<string>(`/setup/associar-admin?usuarioId=${usuarioId}`, {
      method: 'POST',
    });
  }
}
export const grupoAcessoUsuarioService = new GrupoAcessoUsuarioService();
