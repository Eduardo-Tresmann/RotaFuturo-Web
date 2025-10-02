import { baseApiService } from '@/services/baseApiService';
import { GrupoAcesso, GrupoAcessoUsuario } from '@/types/grupo';
class GrupoAcessoService {
  async listarGrupos(): Promise<GrupoAcesso[]> {
    return baseApiService.request<GrupoAcesso[]>('/grupo-acesso');
  }
  async buscarGrupoPorId(id: number): Promise<GrupoAcesso> {
    return baseApiService.request<GrupoAcesso>(`/grupo-acesso/${id}`);
  }
  async criarGrupo(descricao: string): Promise<GrupoAcesso> {
    return baseApiService.request<GrupoAcesso>('/grupo-acesso', {
      method: 'POST',
      body: JSON.stringify({ gruaDescricao: descricao }),
    });
  }
  async atualizarGrupo(id: number, descricao: string): Promise<GrupoAcesso> {
    return baseApiService.request<GrupoAcesso>(`/grupo-acesso/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ gruaId: id, gruaDescricao: descricao }),
    });
  }
  async excluirGrupo(id: number): Promise<void> {
    await baseApiService.request(`/grupo-acesso/${id}`, {
      method: 'DELETE',
    });
  }
}
export const grupoAcessoService = new GrupoAcessoService();
