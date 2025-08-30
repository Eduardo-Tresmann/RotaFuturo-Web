# Plano de Desenvolvimento - Simulador de Carreira Interativo "Rota Futuro"

## 📋 Visão Geral
Sistema web educacional para ajudar alunos do ensino médio a explorar carreiras através de questionários personalizados, trilhas de aprendizado e dados reais do mercado de trabalho.

## 🎯 Objetivos Principais
1. **Cadastro e Questionário Inicial** - Perfil do aluno com preferências e interesses
2. **Sugestão de Carreiras** - Ranking baseado no perfil com dados do mercado
3. **Trilhas de Aprendizado** - Módulos progressivos com gamificação
4. **Mapeamento de Matérias** - Análise de competências desenvolvidas
5. **Exploração de Mercado** - Dados reais e depoimentos profissionais
6. **Relatório de Evolução** - Progresso e recomendações atualizadas

## 🏗️ Estrutura Técnica

### Tecnologias Utilizadas
- **Frontend**: Next.js 15.4.6 + React 19.1.0 + TypeScript
- **Estilização**: Tailwind CSS + Tailwind Animate
- **UI Components**: Radix UI + Componentes customizados
- **Gerenciamento de Estado**: React Context + Hooks personalizados
- **API Client**: Axios + Serviços customizados
- **Autenticação**: JWT + localStorage

### Estrutura de Pastas Atual
```
src/
├── app/                 # Pages do Next.js
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   └── perfil/         # Perfil do usuário
├── components/         # Componentes React
│   ├── context/        # Contextos (Auth, Theme)
│   └── ui/             # Componentes UI reutilizáveis
├── hooks/              # Hooks personalizados
├── services/           # Serviços de API
├── types/              # Tipos TypeScript
└── utils/              # Utilitários
```

## 📊 Funcionalidades Detalhadas

### 1. Cadastro e Questionário Inicial
**Arquivos a criar:**
- `src/app/questionario/page.tsx` - Página do questionário
- `src/components/questionario/QuestionarioForm.tsx` - Formulário de perguntas
- `src/services/questionario/QuestionarioService.ts` - Serviço para salvar respostas
- `src/types/questionario.ts` - Tipos para perguntas e respostas

**Perguntas do Questionário:**
- Preferências de disciplinas (Matemática, Biologia, Artes, História, Tecnologia)
- Estilo de aprendizagem (Visual, Auditivo, Cinestésico)
- Interesses pessoais e objetivos profissionais
- Habilidades naturais e competências

### 2. Sugestão de Carreiras
**Arquivos a criar:**
- `src/app/carreiras/page.tsx` - Lista de carreiras sugeridas
- `src/components/carreiras/CarreiraCard.tsx` - Card individual de carreira
- `src/services/carreira/CarreiraService.ts` - Serviço de dados de carreiras
- `src/types/carreira.ts` - Tipos para carreiras e mercado

**Dados por Carreira:**
- Nome e descrição da profissão
- Áreas de atuação principais
- Salário médio (regional e nacional)
- Nível de demanda no mercado
- Perspectivas futuras

### 3. Trilhas de Aprendizado
**Arquivos a criar:**
- `src/app/trilhas/[id]/page.tsx` - Página da trilha específica
- `src/components/trilhas/ModuloCard.tsx` - Card de módulo de aprendizado
- `src/services/trilha/TrilhaService.ts` - Serviço de progresso da trilha
- `src/types/trilha.ts` - Tipos para trilhas e módulos

**Estrutura das Trilhas:**
- Módulos organizados por temas relevantes
- Conteúdos multimídia (vídeos, textos, quizzes)
- Sistema de XP por conclusão de módulos
- Liberação progressiva de conteúdos

### 4. Mapeamento de Matérias
**Arquivos a criar:**
- `src/app/evolucao/page.tsx` - Painel de evolução
- `src/components/evolucao/MateriasChart.tsx` - Gráfico de matérias
- `src/components/evolucao/CompetenciasChart.tsx` - Gráfico de competências
- `src/services/evolucao/EvolucaoService.ts` - Serviço de análise de progresso

**Métricas:**
- Porcentagem de cada disciplina estudada
- Competências dominadas (raciocínio lógico, empatia, criatividade)
- Áreas de maior afinidade e desenvolvimento

### 5. Exploração de Mercado
**Arquivos a criar:**
- `src/app/mercado/[id]/page.tsx` - Detalhes do mercado por carreira
- `src/components/mercado/MercadoInfo.tsx` - Informações de mercado
- `src/components/mercado/Depoimentos.tsx` - Depoimentos de profissionais
- `src/services/mercado/MercadoService.ts` - Serviço de dados de mercado

**Conteúdo:**
- Dados salariais atualizados
- Demanda atual e perspectivas
- Cursos, palestras e eventos relacionados
- Botão "Quero me aprofundar" para expandir trilha

### 6. Relatório de Evolução
**Arquivos a criar:**
- `src/app/relatorio/page.tsx` - Relatório completo
- `src/components/relatorio/RelatorioCompleto.tsx` - Componente do relatório
- `src/services/relatorio/RelatorioService.ts` - Serviço de geração de relatórios

**Seções do Relatório:**
- Habilidades mais desenvolvidas
- Matérias mais estudadas
- Percentual de afinidade com carreiras
- Histórico de módulos concluídos
- Top 3 carreiras recomendadas

## 🎮 Recursos de Gamificação

### Sistema de XP e Níveis
- XP por conclusão de módulos
- Níveis baseados no XP acumulado
- Medalhas e conquistas por marcos

### Ranking e Competição
- Ranking interno por escola/turma
- Sistema opcional de competição saudável
- Notificações de progresso e conquistas

## 📱 Design e Experiência do Usuário

### Design Responsivo
- Mobile-first approach
- Breakpoints para tablet e desktop
- Navegação intuitiva e acessível

### Componentes UI a Desenvolver
- Questionários interativos
- Cards de carreira com informações visuais
- Progress bars para trilhas
- Gráficos para mapeamento de matérias
- Modais para depoimentos e detalhes

## 🔄 Fluxo do Usuário

1. **Cadastro/Login** → Página de autenticação existente
2. **Questionário Inicial** → Novo questionário de perfil
3. **Sugestões de Carreira** → Lista baseada no perfil
4. **Seleção de Carreira** → Escolha da trilha a seguir
5. **Trilha de Aprendizado** → Módulos progressivos
6. **Painel de Evolução** → Acompanhamento do progresso
7. **Exploração de Mercado** → Dados profissionais
8. **Relatório Final** → Análise completa

## 🗓️ Cronograma de Desenvolvimento

### Fase 1: Foundation (1-2 dias)
- [ ] Estrutura de tipos e interfaces
- [ ] Serviços base para questionário e carreiras
- [ ] Componentes UI básicos para questionários

### Fase 2: Core Features (3-5 dias)
- [ ] Página de questionário completo
- [ ] Sistema de sugestão de carreiras
- [ ] Estrutura básica das trilhas

### Fase 3: Advanced Features (5-7 dias)
- [ ] Módulos de aprendizado interativos
- [ ] Sistema de XP e gamificação
- [ ] Mapeamento de matérias e competências

### Fase 4: Polish & Analytics (2-3 dias)
- [ ] Relatórios de evolução
- [ ] Dados de mercado reais
- [ ] Otimizações de performance

## 🚀 Próximos Passos Imediatos

1. **Criar estrutura de tipos** para questionário, carreiras e trilhas
2. **Implementar serviço base** para gerenciar dados do questionário
3. **Desenvolver página de questionário** com formulário dinâmico
4. **Criar algoritmo** de matching para sugestão de carreiras
5. **Implementar dashboard** com sugestões iniciais

## 📈 Métricas de Sucesso

- Tempo médio de conclusão do questionário
- Taxa de engajamento com as trilhas
- Número de carreiras exploradas por usuário
- Satisfação com as recomendações recebidas
- Retenção e retorno dos usuários

## 🔧 Dependências Técnicas

### APIs Necessárias
- API de autenticação (já existe)
- API para salvar respostas do questionário
- API para dados de carreiras e mercado
- API para progresso das trilhas
- API para analytics e relatórios

### Bibliotecas a Considerar
- `react-hook-form` para formulários complexos
- `recharts` ou `chart.js` para gráficos
- `framer-motion` para animações
- `react-query` para gerenciamento de estado da API

## 🎯 MVP (Minimum Viable Product)

1. Questionário funcional com 10-15 perguntas
2. Sistema básico de sugestão de 5-10 carreiras
3. Trilha demonstrativa com 3 módulos
4. Painel simples de evolução
5. Design responsivo básico

Este documento será atualizado conforme o desenvolvimento avança e novas decisões são tomadas.
