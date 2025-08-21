export interface Usuario {
  usuId: number;
  usuEmail: string;
  usuSenha?: string;
  usuDataCadastro: string;
  usuHoraCadastro: string;
  usuEmailValidado: boolean;
  usuAtivo: boolean;
  usuTrocaSenha: boolean;
  usuSenhaAntiga1?: string;
  usuSenhaAntiga2?: string;
}

export interface UsuarioCriacaoDTO {
  usuEmail: string;
  usuSenha: string;
}

export interface LoginRequest {
  usuEmail: string;
  usuSenha: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea';
  required?: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}
