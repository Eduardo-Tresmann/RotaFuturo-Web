import { baseApiService } from '@/services/baseApiService';
import { LoginResponse } from '@/types';

class AuthService {
  async login(email: string, password: string): Promise<string> {
    const response = await baseApiService.request<LoginResponse>(
      '/login/fazer-login',
      {
        method: 'POST',
        body: JSON.stringify({ usuEmail: email, usuSenha: password }),
      }
    );

    baseApiService.setToken(response.token);

    return response.token;
  }

  async registrar(email: string, password: string): Promise<any> {
    return baseApiService.request('/usuario/registrar', {
      method: 'POST',
      body: JSON.stringify({ usuEmail: email, usuSenha: password }),
    });
  }

  logout() {
    baseApiService.clearToken();
  }

  getToken(): string | null {
    return baseApiService.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// setToken(token: string) {
//   baseApiService.setToken(token);
// }

export const authService = new AuthService();
