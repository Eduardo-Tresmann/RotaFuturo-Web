import { baseApiService } from '@/services/baseApiService';
import { Usuario } from '@/types/usuario';

class UsuarioService {
  async alterarSenha(id: number, novaSenha: string): Promise<void> {
    await baseApiService.request(`/usuario/${id}/alterar-senha`, {
      method: 'POST',
      body: JSON.stringify({ novaSenha }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async getCurrentUser(): Promise<Usuario> {
    return baseApiService.request<Usuario>('/usuario/me');
  }

  async getUserById(id: number): Promise<Usuario> {
    return baseApiService.request<Usuario>(`/usuario/${id}`);
  }

  async updateUser(id: number, userData: Partial<Usuario>): Promise<Usuario> {
    return baseApiService.request<Usuario>(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async listAll(): Promise<Usuario[]> {
    return baseApiService.request<Usuario[]>('/usuario');
  }

  async deleteUser(id: number): Promise<void> {
    await baseApiService.request(`/usuario/${id}`, {
      method: 'DELETE',
    });
  }

  async inativarUser(id: number): Promise<Usuario> {
    return baseApiService.request<Usuario>(`/usuario/${id}/inativar`, {
      method: 'PATCH',
    });
  }
}

export const usuarioService = new UsuarioService();
