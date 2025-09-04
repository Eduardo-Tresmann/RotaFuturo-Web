// components/LoginForm.tsx (ou o caminho do seu arquivo de formulário)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Shield, AlertCircle, CheckCircle, AtSign } from 'lucide-react';
import { useAuthContext } from '@/components/context/AuthContext'; // <--- Usar useAuthContext
import { FormLabel } from '@/components/ui/form-components/form-label';
import { EmailField } from '@/components/ui/form-components/email-field';
import { PasswordField } from '@/components/ui/form-components/password-field';
import { FormButton } from '@/components/ui/form-components/form-button';
import { FormNotification } from '@/components/ui/form-components/form-notification';

interface LoginFormProps {
  onBack: () => void;
}

export function LoginForm({ onBack }: LoginFormProps) {
  const { login, loading } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      FormNotification.error({
        message: 'Preencha todos os campos para continuar.',
        icon: AlertCircle,
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      FormNotification.error({
        message: 'Formato de email inválido.',
        icon: AlertCircle,
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    if (formData.password.length < 6) {
      FormNotification.error({
        message: 'A senha deve ter pelo menos 6 caracteres.',
        icon: AlertCircle,
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    try {
      await login({
        usuEmail: formData.email,
        usuSenha: formData.password,
      });
      FormNotification.success({
        message: 'Login realizado com sucesso! Bem-vindo de volta!',
        icon: CheckCircle,
        duration: 2000,
        position: 'top-center',
      });
    } catch (error: any) {
      let errorMsg = error?.message || 'Email ou senha incorretos. Verifique suas credenciais.';
      // Se vier erro HTTP, mostra status
      if (errorMsg.includes('HTTP error!')) {
        errorMsg = 'Erro de autenticação: usuário ou senha inválidos.';
      }
      FormNotification.error({
        message: errorMsg,
        icon: AlertCircle,
        duration: 5000,
        position: 'top-center',
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 text-zinc-500 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold bg-zinc-900 dark:bg-zinc-300 to-zinc-600 bg-clip-text text-transparent">
          Bem-vindo de volta
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <EmailField
            id="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
            icon={AtSign}
            iconColor="text-blue-400"
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
            icon={Shield}
            iconColor="text-green-500"
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition-all duration-200"
          />
        </div>

        <FormButton
          type="submit"
          size="lg"
          loading={loading}
          variant="outline"
          className="bg-zinc-900 dark:bg-zinc-700 text-white border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-600
            shadow-soft hover:shadow-glow transition-all duration-300 font-semibold text-base py-3
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <User className="h-4 w-4 mr-2" />
          {loading ? 'Entrando...' : 'Entrar na plataforma'}
        </FormButton>
      </form>
    </div>
  );
}
