import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Serviço para gerenciar configurações
 */
export const configService = {
  /**
   * Busca configurações da aplicação
   */
  async getConfig() {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      // Retorna null para os IDs dos testes caso não consiga obter do backend
      return {
        testeVocacionalId: null,
        testeSubareaId: null,
      };
    }
  },

  /**
   * Busca o ID do teste de subárea para uma área específica
   * @param areaId ID da área selecionada
   * @returns Objeto com o ID do teste de subárea
   */
  async getTesteSubareaByArea(areaId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/config/teste-subarea/${areaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar teste de subárea para área ${areaId}:`, error);
      // Retorna null para o ID do teste caso não consiga obter do backend
      return { testeSubareaId: null };
    }
  },
};

export default configService;
