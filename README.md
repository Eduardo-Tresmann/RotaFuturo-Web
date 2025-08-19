# RotaFuturo Web

Frontend da plataforma RotaFuturo, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **Class Variance Authority** - Sistema de variantes de componentes
- **Tailwind Merge** - Merge inteligente de classes CSS

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── layout/           # Componentes de layout
│       └── Header.tsx
├── hooks/                # Custom hooks
│   └── useAuth.ts        # Hook de autenticação
├── lib/                  # Utilitários
│   └── utils.ts          # Funções utilitárias
├── services/             # Serviços externos
│   └── api.ts            # Cliente da API
├── styles/               # Estilos globais
│   └── globals.css       # CSS global
└── types/                # Definições de tipos TypeScript
    └── index.ts          # Tipos da aplicação
```

## 🎨 Padrões de Design

### Componentes UI

- Baseados no design system do shadcn/ui
- Utilizam `class-variance-authority` para variantes
- Totalmente tipados com TypeScript
- Responsivos e acessíveis

### Estrutura de Pastas

- **Separação clara de responsabilidades**
- **Componentes reutilizáveis** em `/components/ui`
- **Hooks customizados** para lógica de negócio
- **Tipos centralizados** em `/types`
- **Serviços isolados** para comunicação externa

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`Button.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **Tipos**: PascalCase (`Usuario`, `LoginRequest`)
- **Arquivos**: kebab-case para páginas (`login-page.tsx`)

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8888
```

## 🔧 Desenvolvimento

### Adicionando Novos Componentes UI

1. Crie o componente em `/components/ui/`
2. Use `class-variance-authority` para variantes
3. Exporte o componente e suas variantes
4. Adicione tipos TypeScript apropriados

### Exemplo de Componente:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva('base-classes', {
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

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component, componentVariants };
```

### Adicionando Novas Páginas

1. Crie a pasta em `/app/` seguindo a convenção do App Router
2. Adicione `page.tsx` para a rota
3. Use os componentes UI existentes
4. Implemente a lógica necessária

## 🔐 Autenticação

O projeto utiliza um sistema de autenticação baseado em JWT:

- **AuthProvider**: Contexto global para estado de autenticação
- **useAuth**: Hook para acessar funcionalidades de auth
- **apiService**: Cliente da API com gerenciamento automático de tokens

### Uso do Hook de Autenticação:

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  // Usar as funcionalidades de auth
}
```

## 🎯 Próximos Passos

- [✅] Implementar páginas de login/registro
- [ ] Adicionar dashboard do usuário
- [ ] Implementar sistema de rotas protegidas
- [ ] Adicionar testes unitários
- [ ] Configurar CI/CD
- [ ] Implementar tema escuro
- [ ] Adicionar animações e transições

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linter

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

