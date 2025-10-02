import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const configService = {
  async getConfig() {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return {
        testeVocacionalId: null,
        testeSubareaId: null,
      };
    }
  },
  async getTesteSubareaByArea(areaId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/config/teste-subarea/${areaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar teste de subárea para área ${areaId}:`, error);
      return { testeSubareaId: null };
    }
  },
};
export default configService;
