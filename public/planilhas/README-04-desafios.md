# Template: 04-desafios.xlsx

## Estrutura da Planilha

Este arquivo Excel deve conter **2 abas** com os seguintes nomes e estruturas:

### Aba 1: DESAFIO

Contém os desafios.

**Colunas:**

- `DES_TITULO` (Coluna A) - Título do desafio (campo único de identificação)
- `DES_DESCRICAO` (Coluna B) - Descrição completa do desafio
- `NIV_ID` (Coluna C) - ID do nível (1 a 5) - opcional
- `AREA_REF` (Coluna D) - Descrição da área (opcional - deve existir na tabela AREA)
- `AREASUB_REF` (Coluna E) - Descrição da subárea (opcional - deve existir na tabela AREASUB)

**Exemplo:**

```
DES_TITULO                           | DES_DESCRICAO                                              | NIV_ID | AREA_REF          | AREASUB_REF
Desafio ADS: Fundamentos             | Conceitos iniciais e lógica de programação básica          | 1      | Matemática        | Análise e Desenvolvimento de Sistemas
Desafio ARQ: Projeto Sustentável     | Aplicação de bioclimatismo e integração de tecnologia      | 5      | Matemática        | Arquitetura e Urbanismo
Desafio ECIV: Estruturas de Concreto | Pré-dimensionamento e análise de esforços em estruturas    | 4      | Matemática        | Engenharia Civil
Desafio SI: Gestão de Projetos e TI  | Aplicação de metodologias ágeis e governança de TI         | 4      | Matemática        | Sistemas de Informação
```

---

### Aba 2: DESAFIOQUESTIONARIO

Vincula desafios aos questionários.

**Colunas:**

- `DES_TITULO_REF` (Coluna A) - Título do desafio (referência à aba DESAFIO)
- `QUES_DESCRICAO_REF` (Coluna B) - Descrição do questionário (referência à tabela QUESTIONARIO)

**Exemplo:**

```
DES_TITULO_REF                       | QUES_DESCRICAO_REF
Desafio ADS: Fundamentos             | Questionário Análise e Desenvolvimento de Sistemas - Nível 1
Desafio ADS: Estrutura de Dados      | Questionário Análise e Desenvolvimento de Sistemas - Nível 2
Desafio ARQ: Conceitos Iniciais      | Questionário Arquitetura e Urbanismo - Nível 1
Desafio ARQ: Projeto Sustentável     | Questionário Arquitetura e Urbanismo - Nível 5
Desafio ECIV: Bases da Construção    | Questionário Engenharia Civil - Nível 1
Desafio SI: Programação Orientada    | Questionário Sistemas de Informação - Nível 2
```

---

## Regras de Importação

1. **Ordem de importação:** DESAFIO → DESAFIOQUESTIONARIO
2. **Chaves de referência:**
   - Desafio: usa `DES_TITULO` (título único)
   - Questionário: usa `QUES_DESCRICAO_REF`
   - Nível: usa `NIV_ID` (ID numérico de 1 a 5)
   - Área: usa `AREA_REF` (descrição da área)
   - Subárea: usa `AREASUB_REF` (descrição da subárea)
3. **Campos obrigatórios:**
   - `DES_TITULO` (Coluna A) - identificador único do desafio
   - `DES_DESCRICAO` (Coluna B) - descrição do desafio
4. **Campos opcionais:**
   - `NIV_ID` (Coluna C) - deve ser um número de 1 a 5 (ID do nível)
   - `AREA_REF` (Coluna D) - deve existir na tabela AREA
   - `AREASUB_REF` (Coluna E) - deve existir na tabela AREASUB
   - `QUES_DESCRICAO_REF` (aba 2) - deve existir na tabela QUESTIONARIO
5. **Dependências externas:**
   - `QUES_DESCRICAO_REF` → tabela QUESTIONARIO (importada via planilha 03)
   - `NIV_ID` → tabela NIVEL (valores 1-5, importada via planilha 01)
   - `AREA_REF` → tabela AREA (importada via planilha 01)
   - `AREASUB_REF` → tabela AREASUB (importada via planilha 01)
   - ⚠️ **Importante:** Execute a planilha 01 e 03 ANTES desta!
6. **Atualização:** Se o desafio já existir (mesmo título), será atualizado
7. **Múltiplos vínculos:** Um desafio pode ter vários questionários

## Endpoint da API

```
POST /api/importacao/desafios
Content-Type: multipart/form-data
Authorization: Bearer {token}

Requisitos:
- Usuário deve ter grupo "Administrador" (case-insensitive)
- Arquivo .xlsx com as 2 abas
- Questionários já devem estar cadastrados (planilha 03)
```

## Observações

- As datas de cadastro são preenchidas automaticamente
- Campos "ativo" não precisam ser preenchidos (padrão: true)
- Caching de FKs ativo para melhor performance
- Importação rápida (poucas abas e registros)
- Um desafio pode compor vários questionários diferentes

## Exemplo de Uso Completo

### 1. Criar Desafios (Aba DESAFIO):

```
DES_TITULO          | DES_DESCRICAO                                       | NIV_DESCRICAO | AREA_DESCRICAO | AREAS_DESCRICAO
Maratona de Código  | Complete 20 desafios de programação em 3 horas      | Avançado      | Tecnologia     | Programação
```

### 2. Vincular aos Questionários (Aba DESAFIOQUESTIONARIO):

```
DES_TITULO          | QUES_DESCRICAO
Maratona de Código  | Questionário de Algoritmos Básicos
Maratona de Código  | Questionário de Estruturas de Dados
Maratona de Código  | Questionário de Complexidade
```

### 3. Resultado:

O desafio "Maratona de Código" conterá 3 questionários vinculados, cada um com suas respectivas questões (já importadas na planilha 03).

---

## Ordem Recomendada de Importação

Para garantir que todas as dependências sejam atendidas, importe as planilhas nesta ordem:

1. **01-estrutura-base.xlsx** - Áreas, Cursos, Níveis, Tipos
2. **02-testes-vocacionais.xlsx** - Testes e Questões Vocacionais
3. **03-questionarios-questoes.xlsx** - Questionários e suas Questões (+1000)
4. **04-desafios.xlsx** - Desafios vinculados aos Questionários ← **VOCÊ ESTÁ AQUI**
