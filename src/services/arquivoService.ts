import axios from 'axios';
import { baseApiService } from './baseApiService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const arquivoService = {
  async uploadFotoPerfil(file: File, usuId: number) {
    const formData = new FormData();
    formData.append('file', file);
    const token = baseApiService.getToken();
    const headers: any = { 'Content-Type': 'multipart/form-data' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await axios.post(
      `${API_BASE_URL}/api/arquivo/upload/${usuId}`,
      formData,
      { headers }
    );
    // Garante que retorna { url: string }
    if (response.data && response.data.url) {
      return { url: response.data.url };
    }
    return { url: '' };
  },
};
