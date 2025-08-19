import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  AtSign,
  Shield,
  ShieldCheck,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FormLabel } from '@/components/ui/form-components/form-label';
import { EmailField } from '@/components/ui/form-components/email-field';
import { PasswordField } from '@/components/ui/form-components/password-field';
import { FormButton } from '@/components/ui/form-components/form-button';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { apiService } from '@/services/api';

interface RegisterFormProps {
  onBack: () => void;
}

export function RegisterForm({ onBack }: RegisterFormProps) {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [checkingEmail, setCheckingEmail] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const validateEmail = async () => {
      const email = formData.email.trim();
      if (!email) {
        setErrors(prev => ({ ...prev, email: '' }));
        return;
      }

      if (!isValidEmail(email)) {
        setErrors(prev => ({ ...prev, email: 'Formato de email inválido' }));
        return;
      }

      setCheckingEmail(true);
      try {
        const response = await apiService.request<{ exists: boolean }>(
          `/usuario/exists?email=${encodeURIComponent(email)}`
        );
        if (response.exists) {
          setErrors(prev => ({ ...prev, email: 'Email já cadastrado' }));
        } else {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      } catch (error: any) {
        if (error.message.includes('E-mail já cadastrado')) {
          setErrors(prev => ({ ...prev, email: 'Email já cadastrado' }));
        } else {
          FormNotification.error({
            message: error.message || 'Erro ao criar conta. Tente novamente.',
            icon: AlertCircle,
            duration: 5000,
          });
        }
      }
    };

    const timeout = setTimeout(validateEmail, 500);
    return () => clearTimeout(timeout);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email obrigatório' }));
      return;
    }

    if (errors.email) return;
    if (formData.password !== formData.confirmPassword) {
      FormNotification.error({
        message: 'As senhas não coincidem. Verifique e tente novamente.',
        icon: AlertCircle,
        duration: 5000,
        position: 'top-right',
        
      });
      return;
    }

    try {
      await register(formData.email, formData.password);
      FormNotification.success({
        message: 'Conta criada com sucesso! Bem-vindo ao RotaFuturo!',
        icon: CheckCircle,
        duration: 4000,
        position: 'top-right',
        
      });
    } catch (error: any) {
      FormNotification.error({
        message: error.message || 'Erro ao criar conta. Tente novamente.',
        icon: AlertCircle,
        duration: 5000,
        position: 'top-right',
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
          Criar conta
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
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
            icon={AtSign}
            iconColor="text-blue-400"
            error={errors.email}
            className="bg-white/80 backdrop-blur-sm border-zinc-200 focus:border-zinc-400 
      focus:ring-2 focus:ring-zinc-100 placeholder:text-zinc-400 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={e =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            disabled={loading}
            icon={Shield}
            iconColor="text-teal-500"
            className="bg-white/80 backdrop-blur-sm border-zinc-200 
              focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 
              placeholder:text-zinc-400 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <PasswordField
            id="confirmPassword"
            label="Confirme a Senha"
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={e =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            disabled={loading}
            icon={ShieldCheck}
            iconColor="text-teal-500"
            className="bg-white/80 backdrop-blur-sm border-zinc-200 
              focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 
              placeholder:text-zinc-400 transition-all duration-200"
          />
        </div>

        <FormButton
          type="submit"
          size="lg"
          loading={loading}
          variant="outline"
          className="bg-zinc-900 text-white border-transparent hover:bg-zinc-800 
            shadow-soft hover:shadow-glow transition-all duration-300 font-semibold text-base py-3 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? 'Criando conta...' : 'Criar minha conta'}
        </FormButton>
      </form>
    </div>
  );
}
