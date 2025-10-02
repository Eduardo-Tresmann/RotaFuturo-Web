export interface GrupoAcesso {
  gruaId: number;
  gruaDescricao: string;
}
export interface GrupoAcessoUsuario {
  gauId: number;
  grupoAcesso: GrupoAcesso;
  usuario: {
    usuId: number;
  };
}
