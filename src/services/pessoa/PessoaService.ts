import { baseApiService } from '@/services/baseApiService';
import { Pessoa } from '@/types/pessoa';

class PessoaService {
  async listAll(): Promise<Pessoa[]> {
    return baseApiService.request<Pessoa[]>('/pessoa');
  }

  async getMyPessoa(): Promise<Pessoa | null> {
    try {
      return await baseApiService.request<Pessoa>('/pessoa/me');
    } catch {
      return null;
    }
  }

  async getPessoaByUsuarioId(usuarioId: number): Promise<Pessoa | null> {
    try {
      return await baseApiService.request<Pessoa>(`/pessoa/usuario/${usuarioId}`);
    } catch {
      return null;
    }
  }

  async createPessoa(pessoa: Partial<Pessoa> | FormData): Promise<Pessoa> {
    let options: RequestInit;
    if (pessoa instanceof FormData) {
      options = {
        method: 'POST',
        body: pessoa,
      };
    } else {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pessoa),
      };
    }
    return baseApiService.request<Pessoa>('/pessoa', options);
  }

  async updatePessoa(id: number, pessoa: Partial<Pessoa>): Promise<Pessoa> {
    return baseApiService.request<Pessoa>(`/pessoa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pessoa),
    });
  }
}

export const pessoaService = new PessoaService();
