export interface Questao {
  questaoId: number;
  questaoDatacadastro: string;
  questaoHoracadastro: string;
  questaoCodigo: string;
  questaoDescricao: string;
  questaoExperiencia: number;
  questaoAtivo: boolean;
  questaoNivel?: any;
  questaoNivelDescricao?: string;
  questaoTipo?: any;
  questaoTipoDescricao?: string;
  area?: any;
  areaSub?: any;
}
