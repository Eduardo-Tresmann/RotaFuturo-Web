# Template: 03-questionarios-questoes.xlsx

## Estrutura da Planilha

Este arquivo Excel deve conter **4 abas** com os seguintes nomes e estruturas:

### Aba 1: QUESTIONARIO

Contém os questionários.

**Colunas:**

- `QUES_DESCRICAO` (Texto) - Descrição do questionário
- `QUESTIONARIOTIPO_DESCRICAO` (Texto) - Tipo do questionário (referência à tabela QUESTIONARIOTIPO)

**Exemplo:**

```
QUES_DESCRICAO                    | QUESTIONARIOTIPO_DESCRICAO
Questionário de Matemática Básica | Avaliação Diagnóstica
Questionário de Português         | Avaliação Formativa
Questionário de Física            | Simulado ENEM
```

---

### Aba 2: QUESTAO ⚠️ **+1000 REGISTROS**

Contém as questões (tabela grande com processamento em lote).

**Colunas:**

- `QUEST_CODIGO` (Texto) - Código único da questão (ex: Q001, Q002)
- `QUEST_DESCRICAO` (Texto) - Enunciado da questão
- `QUESTAOTIPO_DESCRICAO` (Texto) - Tipo da questão (referência à tabela QUESTAOTIPO)
- `AREA_DESCRICAO` (Texto - Opcional) - Área do conhecimento
- `AREASUB_DESCRICAO` (Texto - Opcional) - Curso/disciplina

**Exemplo:**

```
QUEST_CODIGO | QUEST_DESCRICAO                      | QUESTAOTIPO_DESCRICAO | AREA_DESCRICAO              | AREASUB_DESCRICAO
Q001         | Qual o valor de x na equação 2x=10? | Múltipla Escolha      | Matemática e suas Tecnologias| Matemática
Q002         | Defina fotossíntese                  | Dissertativa          | Ciências da Natureza         | Biologia
Q003         | Analise o texto e responda...        | Interpretação         | Linguagens e suas Tecnologias| Letras
```

**⚠️ ATENÇÃO:**

- Esta aba pode conter **mais de 1000 registros**
- O sistema usa **processamento em lote (batch)** a cada 100 registros
- Importação pode levar alguns minutos
- Verifique os logs para acompanhar o progresso

---

### Aba 3: QUESTAOALTERNATIVA

Contém as alternativas das questões.

**Colunas:**

- `QUEST_CODIGO` (Texto) - Código da questão (referência à aba QUESTAO)
- `QUESA_DESCRICAO` (Texto) - Texto da alternativa
- `QUESA_CORRETA` (Número) - Pontuação (0 = errada, 1+ = correta ou valor de pontuação)

**Exemplo:**

```
QUEST_CODIGO | QUESA_DESCRICAO | QUESA_CORRETA
Q001         | x = 5           | 1
Q001         | x = 10          | 0
Q001         | x = 2           | 0
Q001         | x = 3           | 0
```

---

### Aba 4: QUESTIONARIOQUESTAO

Vincula questionários às questões.

**Colunas:**

- `QUES_DESCRICAO` (Texto) - Descrição do questionário (referência à aba QUESTIONARIO)
- `QUEST_CODIGO` (Texto) - Código da questão (referência à aba QUESTAO)

**Exemplo:**

```
QUES_DESCRICAO                    | QUEST_CODIGO
Questionário de Matemática Básica | Q001
Questionário de Matemática Básica | Q003
Questionário de Português         | Q002
```

---

## Regras de Importação

1. **Ordem de importação:** QUESTIONARIO → QUESTAO → QUESTAOALTERNATIVA → QUESTIONARIOQUESTAO
2. **Chaves de referência:**
   - Questionário: usa QUES_DESCRICAO
   - Questão: usa QUEST_CODIGO (código único)
3. **Campos obrigatórios:**
   - QUES_DESCRICAO, QUESTIONARIOTIPO_DESCRICAO
   - QUEST_CODIGO, QUESTAOTIPO_DESCRICAO
   - Alternativas e vínculos: códigos/descrições de referência
4. **Dependências externas:**
   - QUESTIONARIOTIPO_DESCRICAO → tabela QUESTIONARIOTIPO (planilha 01)
   - QUESTAOTIPO_DESCRICAO → tabela QUESTAOTIPO (planilha 01)
   - AREA_DESCRICAO → tabela AREA (planilha 01)
   - AREASUB_DESCRICAO → tabela AREASUB (planilha 01)
5. **Performance:**
   - Aba QUESTAO: batch processing a cada 100 registros
   - Flush automático do EntityManager para liberar memória
6. **Atualização:** Se existir (mesmo código/descrição), será atualizado

## Endpoint da API

```
POST /api/importacao/questionarios-questoes
Content-Type: multipart/form-data
Authorization: Bearer {token}

Requisitos:
- Usuário deve ter grupo "Administrador" (case-insensitive)
- Arquivo .xlsx com as 4 abas
- Paciência para aguardar processamento de tabela grande (QUESTAO)
```

## Observações

- As datas de cadastro são preenchidas automaticamente
- Campos "ativo" não precisam ser preenchidos (padrão: true)
- Caching de FKs ativo para melhor performance
- **QUESTAO:** Processamento pode levar 2-5 minutos dependendo do volume
- Alternativas sem datacadastro/horacadastro (campos não existem no Bean)
