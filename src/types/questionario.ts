export interface Questionario {
  quesId: number;
  quesDatacadastro: string;
  quesHoracadastro: string;
  quesDescricao: string;
  quesPeso: number;
  quesAtivo: boolean;
  questionarioTipo?: any;
  area?: any;
  areaSub?: any;
}
