# 📘 Sistema RotaFuturo - Documentação Completa

## 1. Visão Geral do Sistema

O **Sistema RotaFuturo** é uma plataforma educacional interativa projetada para ajudar estudantes do ensino médio a explorar carreiras profissionais. O sistema é composto por duas partes principais:

- **RotaFuturo-API**: Backend em Java com Spring Boot e MySQL
- **RotaFuturo-Web**: Frontend em Next.js com TypeScript e Tailwind CSS

### Objetivos Principais

1. **Orientação Vocacional** - Questionários personalizados para identificar afinidades
2. **Sugestão de Carreiras** - Recomendações baseadas no perfil do estudante
3. **Trilhas de Aprendizado** - Conteúdo sequencial sobre carreiras e mercado de trabalho
4. **Mapeamento de Competências** - Associação entre disciplinas e habilidades profissionais
5. **Exploração do Mercado** - Dados reais sobre oportunidades profissionais
6. **Acompanhamento de Progresso** - Relatórios e métricas de evolução

## 2. Arquitetura do Sistema

### Backend (RotaFuturo-API)

- **Linguagem**: Java 21
- **Framework**: Spring Boot 3.5.4
- **Banco de Dados**: MySQL 8+
- **Segurança**: JWT Authentication, Spring Security
- **Gerenciador de Dependências**: Maven

### Frontend (RotaFuturo-Web)

- **Framework**: Next.js 15.4.6
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: Componentes customizados baseados no shadcn/ui
- **Gerenciamento de Estado**: React Context e Hooks personalizados
- **Cliente HTTP**: Serviços customizados com fetch API

## 3. Estrutura de Código

### Backend (API)

```
src/
├── main/
│   ├── java/
│   │   ├── controllers/      # Endpoints da API REST
│   │   ├── models/           # Entidades JPA
│   │   ├── repositories/     # Interfaces de acesso a dados
│   │   ├── services/         # Lógica de negócios
│   │   ├── security/         # Configuração de segurança
│   │   └── utils/            # Classes utilitárias
│   └── resources/
│       ├── application.properties  # Configurações do Spring
│       └── data.sql                # Scripts SQL iniciais
```

### Frontend (Web)

```
src/
├── app/                 # Pages do Next.js
│   ├── auth/           # Autenticação
│   ├── home/           # Interface principal
│   └── admin/          # Painel administrativo
├── components/         # Componentes React
│   ├── context/        # Contextos (Auth, Theme)
│   └── ui/             # Componentes UI reutilizáveis
├── hooks/              # Hooks personalizados
├── services/           # Serviços de API
├── types/              # Tipos TypeScript
└── utils/              # Utilitários
```

## 4. Funcionalidades Principais

### 4.1. Sistema de Autenticação

- **Login e Registro** de usuários
- **Autorização baseada em grupos** (ADMINISTRADOR, USUARIO)
- **Proteção de rotas** por nível de acesso
- **Tokens JWT** armazenados em cookies HttpOnly com flags de segurança
- **Estado de autenticação** gerenciado por hooks personalizados

### 4.2. Questionário Vocacional

- Formulários dinâmicos para identificação de perfil
- Perguntas sobre preferências, habilidades e interesses
- Algoritmo de matching para sugestão de carreiras
- Armazenamento de respostas para análise posterior

### 4.3. Trilhas de Aprendizado

- Módulos organizados por área profissional
- Conteúdo multimídia (textos, vídeos, quizzes)
- Sistema de progresso e gamificação
- Liberação progressiva de conteúdo

### 4.4. Painel Administrativo

- Gerenciamento de usuários e permissões
- Cadastro e edição de conteúdos
- Visualização de métricas e relatórios
- Configurações do sistema

## 5. Segurança

### 5.1. Melhorias Implementadas

- **Eliminação do localStorage** para armazenamento de dados sensíveis
- **Implementação de stateService** para gerenciamento de estado em memória
- **Cookies HttpOnly** para armazenamento de tokens JWT
- **Proteção contra CSRF** em requisições de mutação
- **Verificação rigorosa de autenticação** nos endpoints

### 5.2. Boas Práticas

- Autenticação baseada em tokens JWT com expiração
- Cookies com flags de segurança (SameSite=Strict, Secure)
- Validação e sanitização de entradas
- Gerenciamento seguro de permissões
- Headers de segurança apropriados

### 5.3. Recomendações Futuras

- Implementação de CSRF tokens no backend
- Configuração de CSP (Content Security Policy)
- Rate limiting para prevenção de ataques de força bruta
- Monitoramento de segurança e logging de eventos

## 6. Guias de Desenvolvimento

### 6.1. Configuração do Ambiente

#### Backend (API)

```bash
# Requisitos
- Java JDK 21+
- Maven 3.8+
- MySQL 8+

# Clonar repositório
git clone https://github.com/LOPES-Cristiano/RotaFuturo-API.git
cd RotaFuturo-API

# Instalar dependências
mvn clean install

# Executar aplicação
mvn spring-boot:run
```

#### Frontend (Web)

```bash
# Requisitos
- Node.js 18+
- npm ou yarn

# Clonar repositório
git clone https://github.com/LOPES-Cristiano/RotaFuturo-Web.git
cd RotaFuturo-Web

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

### 6.2. Adicionando Novos Componentes UI

1. Criar o componente em `/components/ui/`
2. Usar `class-variance-authority` para variantes
3. Exportar componente e tipos TypeScript
4. Documentar uso e props

#### Exemplo de Componente:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('base-button-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      secondary: 'secondary-classes',
    },
    size: {
      default: 'default-size',
      sm: 'small-size',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### 6.3. Sistema de Notificações

O sistema utiliza componentes baseados no Sonner para exibir notificações elegantes:

```tsx
// Importação
import { FormNotification } from '@/components/ui/form-components/form-notification';

// Uso
FormNotification.success({
  message: 'Operação realizada com sucesso!',
  duration: 3000,
  position: 'top-center',
});

FormNotification.error({
  message: 'Ocorreu um erro na operação',
  duration: 5000,
  action: {
    label: 'Tentar novamente',
    onClick: () => handleRetry(),
  },
});
```

### 6.4. Hooks Personalizados

#### useAuth

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { usuario, isAuthenticated, loading, login, logout } = useAuth();

  // Exemplo de uso
  if (loading) return <Loading />;
  if (!isAuthenticated) return <LoginRequired />;

  return <p>Bem-vindo, {usuario.nome}!</p>;
}
```

#### useGrupoAcesso

```tsx
import { useGrupoAcesso } from '@/hooks/useGrupoAcesso';

function AdminComponent() {
  const { grupos, isAdmin, temPermissao } = useGrupoAcesso(usuarioId);

  if (!isAdmin) return <AcessoNegado />;
  // ou
  if (!temPermissao('ADMINISTRADOR')) return <AcessoNegado />;

  return <PainelAdmin />;
}
```

## 7. Padrões e Convenções

### Nomenclatura

- **Componentes**: PascalCase (`Button.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.tsx`)
- **Serviços**: camelCase com sufixo `Service` (`usuarioService.ts`)
- **Tipos**: PascalCase (`Usuario.ts`)
- **Arquivos de página**: kebab-case (`login-page.tsx`)

### Organização de Código

- **Separação de responsabilidades** entre UI, lógica e acesso a dados
- **Componentes atômicos** para interface
- **Hooks personalizados** para lógica reutilizável
- **Serviços** para comunicação com API
- **Tipos** para definições de interfaces e tipos

## 8. Próximos Passos

### Desenvolvimento

- Implementar dashboard completo do usuário
- Finalizar módulos de questionários e trilhas
- Adicionar sistema de gamificação
- Implementar visualizações de dados e gráficos

### Segurança

- Validar tokens CSRF no backend
- Configurar headers de segurança adicionais
- Implementar refresh tokens
- Adicionar monitoramento de segurança

### Infraestrutura

- Configurar CI/CD
- Implementar testes automatizados
- Preparar ambiente de homologação
- Documentar APIs com Swagger

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NomeFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NomeFeature`)
5. Abra um Pull Request

## Contato e Suporte

Para questões relacionadas ao desenvolvimento, entre em contato com a equipe de tecnologia através dos canais oficiais do projeto.

---

_Documentação compilada em 01 de outubro de 2025._
