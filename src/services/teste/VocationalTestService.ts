import { baseApiService } from '@/services/baseApiService';

export interface TesteResult {
  areaId: number;
  areaDescricao: string;
  pontuacao: number;
}

class VocationalTestService {
  async getTesteResults(testeId: number, usuarioId: number): Promise<TesteResult[]> {
    try {
      console.log(`Buscando resultados para teste ID: ${testeId} e usuário ID: ${usuarioId}`);
      const results = await baseApiService.request<TesteResult[]>(
        `/testequestaorespondida/resultado/${testeId}/${usuarioId}`,
      );
      console.log('Resultados do teste recebidos:', results);
      return results;
    } catch (error) {
      console.error('Erro ao buscar resultados do teste:', error);
      throw error; // Propagar erro para tratamento no componente
    }
  }
}

export const vocationalTestService = new VocationalTestService();
