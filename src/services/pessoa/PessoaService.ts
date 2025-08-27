import { baseApiService } from '@/services/baseApiService';
import { Pessoa } from '@/types';

class PessoaService {
  async getMyPessoa(): Promise<Pessoa | null> {
    try {
      return await baseApiService.request<Pessoa>('/pessoa/me');
    } catch {
      return null;
    }
  }

  async createPessoa(pessoa: Partial<Pessoa>): Promise<Pessoa> {
    return baseApiService.request<Pessoa>('/pessoa', {
      method: 'POST',
      body: JSON.stringify(pessoa),
    });
  }

  async updatePessoa(id: number, pessoa: Partial<Pessoa>): Promise<Pessoa> {
    return baseApiService.request<Pessoa>(`/pessoa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pessoa),
    });
  }
}

export const pessoaService = new PessoaService();
