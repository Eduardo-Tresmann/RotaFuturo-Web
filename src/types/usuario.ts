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
