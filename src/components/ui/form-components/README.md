# Componentes de Formulário com Ícones

Esta documentação mostra como usar os componentes de formulário padronizados com suporte a ícones do Lucide.

## Componentes Disponíveis

### TextField
Campo de texto básico com suporte a ícones.

```tsx
import { TextField } from '@/components/ui/form-components/text-field';
import { User, Mail, Phone } from 'lucide-react';

// Com ícone
<TextField
  label="Nome completo"
  placeholder="Digite seu nome"
  icon={User}
  required
/>

// Sem ícone
<TextField
  label="Comentário"
  placeholder="Digite seu comentário"
/>
```

### EmailField
Campo de email com validação automática e suporte a ícones.

```tsx
import { EmailField } from '@/components/ui/form-components/email-field';
import { AtSign, Mail } from 'lucide-react';

<EmailField
  label="Email"
  placeholder="seu@email.com"
  icon={AtSign}
  required
/>
```

### PasswordField
Campo de senha com toggle de visibilidade e suporte a ícones.

```tsx
import { PasswordField } from '@/components/ui/form-components/password-field';
import { Shield, Lock, Key } from 'lucide-react';

<PasswordField
  label="Senha"
  placeholder="Digite sua senha"
  icon={Shield}
  required
/>
```

### NumberField
Campo numérico com suporte a ícones.

```tsx
import { NumberField } from '@/components/ui/form-components/number-field';
import { Hash, Target, TrendingUp } from 'lucide-react';

<NumberField
  label="Idade"
  placeholder="Digite sua idade"
  icon={Hash}
  min={0}
  max={120}
  required
/>
```

### PhoneField
Campo de telefone com suporte a ícones.

```tsx
import { PhoneField } from '@/components/ui/form-components/phone-field';
import { Phone, Call } from 'lucide-react';

<PhoneField
  label="Telefone"
  placeholder="(11) 99999-9999"
  icon={Phone}
  required
/>
```

### MoneyField
Campo de valor monetário com símbolo de moeda e suporte a ícones.

```tsx
import { MoneyField } from '@/components/ui/form-components/money-field';
import { DollarSign, Wallet, PiggyBank } from 'lucide-react';

<MoneyField
  label="Salário"
  placeholder="0,00"
  icon={DollarSign}
  currency="R$"
  required
/>
```

## Ícones Recomendados

### Campos de Usuário
- `User` - Nome, usuário
- `AtSign` - Email
- `Shield` - Senha
- `Phone` - Telefone

### Campos Financeiros
- `DollarSign` - Dinheiro
- `Wallet` - Carteira
- `PiggyBank` - Poupança
- `CreditCard` - Cartão de crédito

### Campos de Localização
- `MapPin` - Endereço
- `Globe` - País
- `Building` - Empresa
- `Home` - Casa

### Campos de Tempo
- `Calendar` - Data
- `Clock` - Hora
- `Timer` - Duração

## Estilização

Todos os componentes aceitam a prop `className` para customização adicional:

```tsx
<TextField
  label="Campo customizado"
  icon={User}
  className="border-blue-500 focus:border-blue-600"
/>
```

## Estados de Erro

Para exibir erros de validação:

```tsx
<TextField
  label="Campo com erro"
  icon={User}
  error="Este campo é obrigatório"
  className="border-red-500"
/>
```

## Campos Obrigatórios

Para marcar campos como obrigatórios:

```tsx
<TextField
  label="Campo obrigatório"
  icon={User}
  required
/>
```

O asterisco (*) será exibido automaticamente ao lado do label.
