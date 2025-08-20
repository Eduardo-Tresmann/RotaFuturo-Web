import { baseApiService } from '@/services/baseApiService';
import { Usuario } from '@/types';

class UsuarioService {
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
}

export const usuarioService = new UsuarioService();
