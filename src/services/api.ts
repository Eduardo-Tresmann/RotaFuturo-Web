import { LoginResponse, Usuario } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
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

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.request<LoginResponse>('/usuario/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuEmail: email, usuSenha: password }),
    });
    return response.token;
  }

  async register(email: string, password: string): Promise<any> {
    return this.request('/usuario/registrar', {
      method: 'POST',
      body: JSON.stringify({ usuEmail: email, usuSenha: password }),
    });
  }

  async getCurrentUser(): Promise<Usuario> {
    return this.request('/usuario/me');
  }

  async getUserById(id: number): Promise<Usuario> {
    return this.request(`/usuario/${id}`);
  }
}

export const apiService = new ApiService();
