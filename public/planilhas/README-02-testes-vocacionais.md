# Template: 02-testes-vocacionais.xlsx

## Estrutura da Planilha

Este arquivo Excel deve conter **3 abas** com os seguintes nomes e estruturas:

### Aba 1: TESTE

Contém os testes vocacionais.

**Colunas:**

- `TES_DESCRICAO` (Texto) - Descrição do teste vocacional

**Exemplo:**

```
TES_DESCRICAO
Teste de Aptidão Profissional
Teste de Interesses Profissionais
Teste de Orientação de Carreira
```

---

### Aba 2: TESTEQUESTAO

Contém as questões dos testes.

**Colunas:**

- `TESQ_DESCRICAO` (Texto) - Descrição da questão
- `AREA_DESCRICAO` (Texto) - Nome da área (referência à tabela AREA)
- `AREASUB_DESCRICAO` (Texto) - Nome do curso (referência à tabela AREASUB)

**Exemplo:**

```
TESQ_DESCRICAO                              | AREA_DESCRICAO              | AREASUB_DESCRICAO
Você gosta de trabalhar com números?        | Matemática e suas Tecnologias| Matemática
Você se interessa por experimentos?         | Ciências da Natureza         | Biologia
Você gosta de ler e escrever?               | Linguagens e suas Tecnologias| Letras
```

---

### Aba 3: TESTEQUESTAOVINCULO

Vincula testes às questões.

**Colunas:**

- `TES_DESCRICAO` (Texto) - Descrição do teste (referência à aba TESTE)
- `TESQ_DESCRICAO` (Texto) - Descrição da questão (referência à aba TESTEQUESTAO)

**Exemplo:**

```
TES_DESCRICAO                     | TESQ_DESCRICAO
Teste de Aptidão Profissional     | Você gosta de trabalhar com números?
Teste de Aptidão Profissional     | Você se interessa por experimentos?
Teste de Interesses Profissionais | Você gosta de ler e escrever?
```

---

## Regras de Importação

1. **Ordem de importação:** TESTE → TESTEQUESTAO → TESTEQUESTAOVINCULO
2. **Chaves de referência:** Usa descrições (TES_DESCRICAO, TESQ_DESCRICAO) para vincular registros
3. **Campos obrigatórios:** Todas as descrições são obrigatórias
4. **Dependências externas:**
   - AREA_DESCRICAO deve existir na tabela AREA (importada via planilha 01)
   - AREASUB_DESCRICAO deve existir na tabela AREASUB (importada via planilha 01)
5. **Atualização:** Se o teste/questão já existir (mesma descrição), será atualizado

## Endpoint da API

```
POST /api/importacao/testes-vocacionais
Content-Type: multipart/form-data
Authorization: Bearer {token}

Requisitos:
- Usuário deve ter grupo "Administrador" (case-insensitive)
- Arquivo .xlsx com as 3 abas
```

## Observações

- As datas de cadastro são preenchidas automaticamente
- Campos "ativo" não precisam ser preenchidos (padrão: true)
- Caching de FKs ativo para melhor performance
