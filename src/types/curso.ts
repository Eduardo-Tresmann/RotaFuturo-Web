export interface Curso {
  curId: number;
  curDatacadastro: string;
  curHoracadastro: string;
  curDescricao: string;
  curAtivo: boolean;
  area?: number;
  areaSub?: number;
  areaDescricao?: string;
  areaSubDescricao?: string;
}
