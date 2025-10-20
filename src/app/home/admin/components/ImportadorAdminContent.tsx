import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  importacaoService,
  ImportacaoEstruturaBaseResultado,
  ImportacaoTestesVocacionaisResultado,
  ImportacaoQuestionariosQuestoesResultado,
  ImportacaoDesafiosResultado,
  ImportacaoResultado,
} from '@/services/importacao';

// Componentes Alert inline para evitar problemas de cache do TypeScript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default:
        'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
      destructive:
        'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Alert.displayName = 'Alert';

const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h5>
);

const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);

export function ImportadorAdminContent() {
  // Estados para Estrutura Base (01)
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ImportacaoEstruturaBaseResultado | null>(null);

  // Estados para Testes Vocacionais (02)
  const [arquivoTestesVoc, setArquivoTestesVoc] = useState<File | null>(null);
  const [loadingTestesVoc, setLoadingTestesVoc] = useState(false);
  const [resultadoTestesVoc, setResultadoTestesVoc] =
    useState<ImportacaoTestesVocacionaisResultado | null>(null);

  // Estados para Questionários e Questões (03)
  const [arquivoQuestQues, setArquivoQuestQues] = useState<File | null>(null);
  const [loadingQuestQues, setLoadingQuestQues] = useState(false);
  const [resultadoQuestQues, setResultadoQuestQues] =
    useState<ImportacaoQuestionariosQuestoesResultado | null>(null);

  // Estados para Desafios (04)
  const [arquivoDesafios, setArquivoDesafios] = useState<File | null>(null);
  const [loadingDesafios, setLoadingDesafios] = useState(false);
  const [resultadoDesafios, setResultadoDesafios] = useState<ImportacaoDesafiosResultado | null>(
    null,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setResultado(null);
    }
  };

  const handleImport = async () => {
    if (!arquivo) return;

    setLoading(true);

    try {
      const data = await importacaoService.importarEstruturaBase(arquivo);
      setResultado(data);
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao importar arquivo. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/planilhas/01-estrutura-base.xlsx';
    link.download = '01-estrutura-base.xlsx';
    link.click();
  };

  // Handlers para Testes Vocacionais (02)
  const handleFileChangeTestesVoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoTestesVoc(e.target.files[0]);
      setResultadoTestesVoc(null);
    }
  };

  const handleImportTestesVoc = async () => {
    if (!arquivoTestesVoc) return;
    setLoadingTestesVoc(true);
    try {
      const data = await importacaoService.importarTestesVocacionais(arquivoTestesVoc);
      setResultadoTestesVoc(data);
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao importar arquivo. Verifique o console para mais detalhes.');
    } finally {
      setLoadingTestesVoc(false);
    }
  };

  const downloadTemplateTestesVoc = () => {
    const link = document.createElement('a');
    link.href = '/planilhas/02-testes-vocacionais.xlsx';
    link.download = '02-testes-vocacionais.xlsx';
    link.click();
  };

  // Handlers para Questionários e Questões (03)
  const handleFileChangeQuestQues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoQuestQues(e.target.files[0]);
      setResultadoQuestQues(null);
    }
  };

  const handleImportQuestQues = async () => {
    if (!arquivoQuestQues) return;
    setLoadingQuestQues(true);
    try {
      const data = await importacaoService.importarQuestionariosQuestoes(arquivoQuestQues);
      setResultadoQuestQues(data);
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao importar arquivo. Verifique o console para mais detalhes.');
    } finally {
      setLoadingQuestQues(false);
    }
  };

  const downloadTemplateQuestQues = () => {
    const link = document.createElement('a');
    link.href = '/planilhas/03-questionarios-questoes.xlsx';
    link.download = '03-questionarios-questoes.xlsx';
    link.click();
  };

  // Handlers para Desafios (04)
  const handleFileChangeDesafios = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivoDesafios(e.target.files[0]);
      setResultadoDesafios(null);
    }
  };

  const handleImportDesafios = async () => {
    if (!arquivoDesafios) return;
    setLoadingDesafios(true);
    try {
      const data = await importacaoService.importarDesafios(arquivoDesafios);
      setResultadoDesafios(data);
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao importar arquivo. Verifique o console para mais detalhes.');
    } finally {
      setLoadingDesafios(false);
    }
  };

  const downloadTemplateDesafios = () => {
    const link = document.createElement('a');
    link.href = '/planilhas/04-desafios.xlsx';
    link.download = '04-desafios.xlsx';
    link.click();
  };

  const getTotalInseridos = (resultado: ImportacaoEstruturaBaseResultado) => {
    return (
      (resultado.areas?.inseridos || 0) +
      (resultado.areasSub?.inseridos || 0) +
      (resultado.niveis?.inseridos || 0) +
      (resultado.questionarioTipos?.inseridos || 0) +
      (resultado.questaoTipos?.inseridos || 0)
    );
  };

  const getTotalErros = (resultado: ImportacaoEstruturaBaseResultado) => {
    return (
      (resultado.areas?.erros || 0) +
      (resultado.areasSub?.erros || 0) +
      (resultado.niveis?.erros || 0) +
      (resultado.questionarioTipos?.erros || 0) +
      (resultado.questaoTipos?.erros || 0)
    );
  };

  // Helpers para Testes Vocacionais
  const getTotalInseridosTestesVoc = (resultado: ImportacaoTestesVocacionaisResultado) => {
    return (
      (resultado.testes?.inseridos || 0) +
      (resultado.testesQuestao?.inseridos || 0) +
      (resultado.testesQuestaoVinculo?.inseridos || 0)
    );
  };

  const getTotalErrosTestesVoc = (resultado: ImportacaoTestesVocacionaisResultado) => {
    return (
      (resultado.testes?.erros || 0) +
      (resultado.testesQuestao?.erros || 0) +
      (resultado.testesQuestaoVinculo?.erros || 0)
    );
  };

  // Helpers para Questionários e Questões
  const getTotalInseridosQuestQues = (resultado: ImportacaoQuestionariosQuestoesResultado) => {
    return (
      (resultado.questionarios?.inseridos || 0) +
      (resultado.questoes?.inseridos || 0) +
      (resultado.questoesAlternativa?.inseridos || 0) +
      (resultado.questionariosQuestao?.inseridos || 0)
    );
  };

  const getTotalErrosQuestQues = (resultado: ImportacaoQuestionariosQuestoesResultado) => {
    return (
      (resultado.questionarios?.erros || 0) +
      (resultado.questoes?.erros || 0) +
      (resultado.questoesAlternativa?.erros || 0) +
      (resultado.questionariosQuestao?.erros || 0)
    );
  };

  // Helpers para Desafios
  const getTotalInseridosDesafios = (resultado: ImportacaoDesafiosResultado) => {
    return (resultado.desafios?.inseridos || 0) + (resultado.desafiosQuestionario?.inseridos || 0);
  };

  const getTotalErrosDesafios = (resultado: ImportacaoDesafiosResultado) => {
    return (resultado.desafios?.erros || 0) + (resultado.desafiosQuestionario?.erros || 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Importar Estrutura Base
          </CardTitle>
          <CardDescription>
            Importe as áreas, cursos, níveis e tipos de questionários/questões a partir de uma
            planilha Excel (.xlsx)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Template da Planilha
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Baixe o modelo com a estrutura correta
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Selecione o arquivo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                  dark:file:bg-blue-950 dark:file:text-blue-300"
              />
              <Button
                onClick={handleImport}
                disabled={!arquivo || loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </>
                )}
              </Button>
            </div>
            {arquivo && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arquivo selecionado: {arquivo.name}
              </p>
            )}
          </div>

          {/* Estrutura Esperada */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Estrutura da Planilha
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              A planilha deve conter 5 abas com os seguintes nomes:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                • <strong>AREA</strong> - Áreas do ENEM (4 registros)
              </li>
              <li>
                • <strong>AREASUB</strong> - Cursos por área (32 registros)
              </li>
              <li>
                • <strong>NIVEL</strong> - Níveis de dificuldade (5 registros)
              </li>
              <li>
                • <strong>QUESTIONARIOTIPO</strong> - Tipos de questionário
              </li>
              <li>
                • <strong>QUESTAOTIPO</strong> - Tipos de questão
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Resultado da Importação */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resultado.sucesso ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              )}
              Resultado da Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mensagem Geral */}
            <Alert variant={resultado.sucesso ? 'default' : 'destructive'}>
              <AlertTitle>{resultado.sucesso ? 'Sucesso!' : 'Concluído com Avisos'}</AlertTitle>
              <AlertDescription>{resultado.mensagemGeral}</AlertDescription>
            </Alert>

            {/* Resumo Geral */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Total Inseridos</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {getTotalInseridos(resultado)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">Total Erros</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {getTotalErros(resultado)}
                </p>
              </div>
            </div>

            {/* Detalhes por Aba */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Detalhes por Aba</h3>

              {resultado.areas && <ResultadoAba resultado={resultado.areas} nome="Áreas" />}
              {resultado.areasSub && <ResultadoAba resultado={resultado.areasSub} nome="Cursos" />}
              {resultado.niveis && <ResultadoAba resultado={resultado.niveis} nome="Níveis" />}
              {resultado.questionarioTipos && (
                <ResultadoAba
                  resultado={resultado.questionarioTipos}
                  nome="Tipos de Questionário"
                />
              )}
              {resultado.questaoTipos && (
                <ResultadoAba resultado={resultado.questaoTipos} nome="Tipos de Questão" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card 2: Testes Vocacionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-600" />
            Importar Testes Vocacionais
          </CardTitle>
          <CardDescription>
            Importe testes, questões e vínculos para o sistema de testes vocacionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  Template da Planilha
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  3 abas: TESTE, TESTEQUESTAO, TESTEQUESTAOVINCULO
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplateTestesVoc} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Selecione o arquivo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChangeTestesVoc}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100
                  dark:file:bg-purple-950 dark:file:text-purple-300"
              />
              <Button
                onClick={handleImportTestesVoc}
                disabled={!arquivoTestesVoc || loadingTestesVoc}
                className="min-w-[120px] bg-purple-600 hover:bg-purple-700"
              >
                {loadingTestesVoc ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </>
                )}
              </Button>
            </div>
            {arquivoTestesVoc && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arquivo selecionado: {arquivoTestesVoc.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado Testes Vocacionais */}
      {resultadoTestesVoc && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Resultado - Testes Vocacionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Total Inseridos</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {getTotalInseridosTestesVoc(resultadoTestesVoc)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">Total Erros</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {getTotalErrosTestesVoc(resultadoTestesVoc)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {resultadoTestesVoc.testes && (
                <ResultadoAba resultado={resultadoTestesVoc.testes} nome="Testes" />
              )}
              {resultadoTestesVoc.testesQuestao && (
                <ResultadoAba
                  resultado={resultadoTestesVoc.testesQuestao}
                  nome="Questões do Teste"
                />
              )}
              {resultadoTestesVoc.testesQuestaoVinculo && (
                <ResultadoAba resultado={resultadoTestesVoc.testesQuestaoVinculo} nome="Vínculos" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card 3: Questionários e Questões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            Importar Questionários e Questões
          </CardTitle>
          <CardDescription>
            Importe questionários, questões (+1000 registros), alternativas e vínculos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  Template da Planilha
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  4 abas: QUESTIONARIO, QUESTAO, QUESTAOALTERNATIVA, QUESTIONARIOQUESTAO
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplateQuestQues} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção - Tabela Grande</AlertTitle>
            <AlertDescription>
              A aba QUESTAO contém mais de 1000 registros. O processamento em lote está ativado para
              garantir performance.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Selecione o arquivo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChangeQuestQues}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100
                  dark:file:bg-orange-950 dark:file:text-orange-300"
              />
              <Button
                onClick={handleImportQuestQues}
                disabled={!arquivoQuestQues || loadingQuestQues}
                className="min-w-[120px] bg-orange-600 hover:bg-orange-700"
              >
                {loadingQuestQues ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </>
                )}
              </Button>
            </div>
            {arquivoQuestQues && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arquivo selecionado: {arquivoQuestQues.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado Questionários e Questões */}
      {resultadoQuestQues && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Resultado - Questionários e Questões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Total Inseridos</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {getTotalInseridosQuestQues(resultadoQuestQues)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">Total Erros</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {getTotalErrosQuestQues(resultadoQuestQues)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {resultadoQuestQues.questionarios && (
                <ResultadoAba resultado={resultadoQuestQues.questionarios} nome="Questionários" />
              )}
              {resultadoQuestQues.questoes && (
                <ResultadoAba resultado={resultadoQuestQues.questoes} nome="Questões (+1000)" />
              )}
              {resultadoQuestQues.questoesAlternativa && (
                <ResultadoAba
                  resultado={resultadoQuestQues.questoesAlternativa}
                  nome="Alternativas"
                />
              )}
              {resultadoQuestQues.questionariosQuestao && (
                <ResultadoAba resultado={resultadoQuestQues.questionariosQuestao} nome="Vínculos" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card 4: Desafios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Importar Desafios
          </CardTitle>
          <CardDescription>Importe desafios e seus questionários vinculados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Template da Planilha
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  2 abas: DESAFIO, DESAFIOQUESTIONARIO
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplateDesafios} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Selecione o arquivo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChangeDesafios}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700 hover:file:bg-green-100
                  dark:file:bg-green-950 dark:file:text-green-300"
              />
              <Button
                onClick={handleImportDesafios}
                disabled={!arquivoDesafios || loadingDesafios}
                className="min-w-[120px] bg-green-600 hover:bg-green-700"
              >
                {loadingDesafios ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </>
                )}
              </Button>
            </div>
            {arquivoDesafios && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arquivo selecionado: {arquivoDesafios.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado Desafios */}
      {resultadoDesafios && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Resultado - Desafios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Total Inseridos</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {getTotalInseridosDesafios(resultadoDesafios)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">Total Erros</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {getTotalErrosDesafios(resultadoDesafios)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {resultadoDesafios.desafios && (
                <ResultadoAba resultado={resultadoDesafios.desafios} nome="Desafios" />
              )}
              {resultadoDesafios.desafiosQuestionario && (
                <ResultadoAba
                  resultado={resultadoDesafios.desafiosQuestionario}
                  nome="Vínculos com Questionários"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultadoAba({ resultado, nome }: { resultado: ImportacaoResultado; nome: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{nome}</h4>
        {resultado.sucesso ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Linhas:</span>{' '}
          <span className="font-semibold">{resultado.totalLinhas}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Inseridos:</span>{' '}
          <span className="font-semibold text-green-600">{resultado.inseridos}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Erros:</span>{' '}
          <span className="font-semibold text-red-600">{resultado.erros}</span>
        </div>
      </div>
      {resultado.mensagem && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{resultado.mensagem}</p>
      )}

      {/* Erros Detalhados */}
      {resultado.detalhesErros && resultado.detalhesErros.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
          <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Erros:</p>
          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
            {resultado.detalhesErros.map((erro, idx) => (
              <li key={idx}>
                Linha {erro.linha}: {erro.erro}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
