# Sistema de Notificações Personalizável

Este sistema de notificações foi criado usando o **Sonner** da shadcn/ui, oferecendo notificações elegantes e personalizáveis para toda a aplicação.

## 🚀 **Componentes Disponíveis**

### **1. FormNotification**

Componente principal com métodos para diferentes tipos de notificação.

### **2. CustomToast**

Toast personalizado com estilos específicos do projeto.

## 📱 **Como Usar**

### **Importação Básica**

```tsx
import { FormNotification } from '@/components/ui/form-components/form-notification';
```

### **Tipos de Notificação**

#### **Sucesso**

```tsx
FormNotification.success({
  message: 'Operação realizada com sucesso!',
  icon: CheckCircle,
  duration: 3000,
  position: 'top-center',
});
```

#### **Erro**

```tsx
FormNotification.error({
  message: 'Ocorreu um erro na operação',
  icon: AlertCircle,
  duration: 5000,
  position: 'top-center',
  action: {
    label: 'Tentar novamente',
    onClick: () => {
      FormNotification.dismiss();
    },
  },
});
```

#### **Aviso**

```tsx
FormNotification.warning({
  message: 'Atenção! Esta ação não pode ser desfeita.',
  icon: AlertTriangle,
  duration: 4000,
  position: 'top-right',
});
```

#### **Informação**

```tsx
FormNotification.info({
  message: 'Sua sessão expira em 5 minutos.',
  icon: Info,
  duration: 3000,
  position: 'bottom-right',
});
```

#### **Customizada**

```tsx
FormNotification.custom({
  message: 'Notificação personalizada',
  icon: Star,
  duration: 2000,
  position: 'top-left',
});
```

## 🎨 **Personalização**

### **Ícones**

Use qualquer ícone do **Lucide React**:

```tsx
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Star,
  User,
  Shield,
  Mail,
} from 'lucide-react';
```

### **Posições Disponíveis**

- `top-left`
- `top-center`
- `top-right` (padrão)
- `bottom-left`
- `bottom-center`
- `bottom-right`

### **Duração**

- **Sucesso**: 4 segundos (padrão)
- **Erro**: 6 segundos (padrão)
- **Aviso**: 5 segundos (padrão)
- **Info**: 4 segundos (padrão)
- **Custom**: 4 segundos (padrão)

### **Ações Personalizadas**

```tsx
FormNotification.error({
  message: 'Erro na operação',
  action: {
    label: 'Ver detalhes',
    onClick: () => {
      // Sua lógica aqui
      console.log('Ver detalhes clicado');
    },
  },
});
```

## 🔧 **Funcionalidades Avançadas**

### **Dismiss Notificações**

```tsx
// Dismiss todas as notificações
FormNotification.dismiss();

// Dismiss notificação específica
FormNotification.dismissById(id);
```

### **Hook Personalizado**

```tsx
import { useFormNotification } from '@/components/ui/form-components/form-notification';

function MyComponent() {
  const notification = useFormNotification();

  const handleSuccess = () => {
    notification.success({
      message: 'Sucesso!',
      icon: CheckCircle,
    });
  };

  return <button onClick={handleSuccess}>Mostrar Sucesso</button>;
}
```

## 🎯 **Exemplos de Uso nos Formulários**

### **LoginForm**

```tsx
try {
  await login(formData.email, formData.password);

  FormNotification.success({
    message: 'Login realizado com sucesso! Bem-vindo de volta!',
    icon: User,
    duration: 3000,
    position: 'top-center',
  });
} catch (error: any) {
  FormNotification.error({
    message: error.message || 'Erro ao fazer login.',
    icon: AlertCircle,
    duration: 5000,
    position: 'top-center',
    action: {
      label: 'Tentar novamente',
      onClick: () => FormNotification.dismiss(),
    },
  });
}
```

### **RegisterForm**

```tsx
if (formData.password !== formData.confirmPassword) {
  FormNotification.error({
    message: 'As senhas não coincidem.',
    icon: AlertCircle,
    duration: 5000,
    position: 'top-center',
    action: {
      label: 'Entendi',
      onClick: () => FormNotification.dismiss(),
    },
  });
  return;
}
```

## 🎨 **Estilos e Temas**

### **Cores Padrão**

- **Sucesso**: Verde (`text-green-600`)
- **Erro**: Vermelho (`text-red-600`)
- **Aviso**: Amarelo (`text-yellow-600`)
- **Info**: Azul (`text-blue-600`)
- **Custom**: Cinza (`text-gray-600`)

### **Classes CSS Personalizadas**

```tsx
FormNotification.success({
  message: 'Sucesso!',
  className: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
});
```

## 🚀 **Configuração Global**

O **Toaster** está configurado no `layout.tsx` com:

- Posição: `top-right`
- Cores ricas: `richColors`
- Botão de fechar: `closeButton`
- Duração padrão: `4000ms`
- Expansão: `expand={true}`
- Z-index: `z-50`

## 💡 **Dicas de Uso**

1. **Use ícones apropriados** para cada tipo de notificação
2. **Mantenha mensagens claras** e concisas
3. **Ajuste a duração** baseado na importância da mensagem
4. **Use ações** para notificações que requerem interação
5. **Considere a posição** baseado no contexto da interface

## 🔍 **Troubleshooting**

### **Notificação não aparece**

- Verifique se o `Toaster` está no layout
- Confirme se o `FormNotification` está sendo importado
- Verifique o console para erros

### **Estilos não aplicados**

- Use `className` para customizações
- Verifique se as classes Tailwind estão disponíveis
- Use `style` inline para estilos específicos
