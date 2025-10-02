import { stateService } from './stateService';

// Verificando se o ambiente é definido
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
class BaseApiService {
  private token: string | null = null;
  constructor() {
    this.token = this.getTokenFromLocalStorage();
  }
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
      stateService.set('auth-state', new Date().getTime().toString());
    }
  }
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const tokenCookie = this.getCookie('auth-token');
      if (tokenCookie) {
        this.token = tokenCookie;
      }
    }
    return this.token;
  }
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
      stateService.remove('auth-state');
    }
  }
  private getTokenFromLocalStorage(): string | null {
    if (typeof window !== 'undefined') {
      return this.getCookie('auth-token');
    }
    return null;
  }
  private getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    const cookieStr = document.cookie;
    const cookies = cookieStr.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = this.getToken();
    let headers: Record<string, string> = {};
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (options.headers && typeof options.headers === 'object') {
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const method = options.method?.toUpperCase() || 'GET';
    if (['POST', 'PUT', 'DELETE', 'PATCH'].indexOf(method) !== -1) {
      const csrfToken = this.generateCsrfToken();
      headers['X-CSRF-Token'] = csrfToken;
    }
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return {} as T;
    }
    return response.json();
  }
  private generateCsrfToken(): string {
    const timestamp = new Date().getTime().toString();
    const randomValue = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomValue}`;
  }
}
export const baseApiService = new BaseApiService();
