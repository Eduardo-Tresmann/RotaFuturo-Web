import { baseApiService } from '../baseApiService';

export interface ErroImportacao {
  linha: number;
  erro: string;
}

export interface ImportacaoResultado {
  planilha: string;
  aba: string;
  totalLinhas: number;
  inseridos: number;
  atualizados: number;
  erros: number;
  detalhesErros: ErroImportacao[];
  mensagem: string;
  sucesso: boolean;
}

export interface ImportacaoEstruturaBaseResultado {
  areas: ImportacaoResultado;
  areasSub: ImportacaoResultado;
  niveis: ImportacaoResultado;
  questionarioTipos: ImportacaoResultado;
  questaoTipos: ImportacaoResultado;
  sucesso: boolean;
  mensagemGeral: string;
  avisos: string[];
}

export interface ImportacaoTestesVocacionaisResultado {
  testes: ImportacaoResultado;
  testesQuestao: ImportacaoResultado;
  testesQuestaoVinculo: ImportacaoResultado;
}

export interface ImportacaoQuestionariosQuestoesResultado {
  questionarios: ImportacaoResultado;
  questoes: ImportacaoResultado;
  questoesAlternativa: ImportacaoResultado;
  questionariosQuestao: ImportacaoResultado;
}

export interface ImportacaoDesafiosResultado {
  desafios: ImportacaoResultado;
  desafiosQuestionario: ImportacaoResultado;
}

class ImportacaoService {
  private readonly baseUrl = '/api/importacao';

  /**
   * Importa a estrutura base a partir de um arquivo Excel
   * @param arquivo - Arquivo .xlsx contendo as 5 abas (AREA, AREASUB, NIVEL, QUESTIONARIOTIPO, QUESTAOTIPO)
   * @returns Resultado detalhado da importação
   */
  async importarEstruturaBase(arquivo: File): Promise<ImportacaoEstruturaBaseResultado> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return baseApiService.request<ImportacaoEstruturaBaseResultado>(
      `${this.baseUrl}/estrutura-base`,
      {
        method: 'POST',
        body: formData,
      },
    );
  }

  /**
   * Obtém informações sobre o template da planilha
   * @returns Informações sobre o template
   */
  async obterInfoTemplate(): Promise<{ nome: string; descricao: string }> {
    return baseApiService.request<{ nome: string; descricao: string }>(
      `${this.baseUrl}/estrutura-base/template`,
      {
        method: 'GET',
      },
    );
  }

  /**
   * Importa testes vocacionais a partir de um arquivo Excel
   * @param arquivo - Arquivo .xlsx contendo as 3 abas (TESTE, TESTEQUESTAO, TESTEQUESTAOVINCULO)
   * @returns Resultado detalhado da importação
   */
  async importarTestesVocacionais(arquivo: File): Promise<ImportacaoTestesVocacionaisResultado> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return baseApiService.request<ImportacaoTestesVocacionaisResultado>(
      `${this.baseUrl}/testes-vocacionais`,
      {
        method: 'POST',
        body: formData,
      },
    );
  }

  /**
   * Importa questionários e questões a partir de um arquivo Excel
   * @param arquivo - Arquivo .xlsx contendo as 4 abas (QUESTIONARIO, QUESTAO, QUESTAOALTERNATIVA, QUESTIONARIOQUESTAO)
   * @returns Resultado detalhado da importação
   */
  async importarQuestionariosQuestoes(
    arquivo: File,
  ): Promise<ImportacaoQuestionariosQuestoesResultado> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return baseApiService.request<ImportacaoQuestionariosQuestoesResultado>(
      `${this.baseUrl}/questionarios-questoes`,
      {
        method: 'POST',
        body: formData,
      },
    );
  }

  /**
   * Importa desafios a partir de um arquivo Excel
   * @param arquivo - Arquivo .xlsx contendo as 2 abas (DESAFIO, DESAFIOQUESTIONARIO)
   * @returns Resultado detalhado da importação
   */
  async importarDesafios(arquivo: File): Promise<ImportacaoDesafiosResultado> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return baseApiService.request<ImportacaoDesafiosResultado>(`${this.baseUrl}/desafios`, {
      method: 'POST',
      body: formData,
    });
  }
}

export const importacaoService = new ImportacaoService();
