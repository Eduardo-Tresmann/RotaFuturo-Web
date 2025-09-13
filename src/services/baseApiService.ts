import { LoginResponse } from '@/types/usuario';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class BaseApiService {
  private token: string | null = null;

  constructor() {
    this.token = this.getTokenFromLocalStorage();
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private getTokenFromLocalStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Garante que não haja barra duplicada
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    // Sempre busca o token atualizado do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : this.token;

    // Sempre cria um objeto headers simples
    let headers: Record<string, string> = {};
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (options.headers && typeof options.headers === 'object') {
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }

    // Força o Authorization
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export const baseApiService = new BaseApiService();
