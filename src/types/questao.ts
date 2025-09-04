export interface Questao {
  questaoId: number;
  questaoDatacadastro: string;
  questaoHoracadastro: string;
  questaoCodigo: string;
  questaoDescricao: string;
  questaoExperiencia: number;
  questaoAtivo: boolean;
  questaoNivel?: any;
  questaoTipo?: any;
  area?: any;
  areaSub?: any;
}
