import { FormNotification } from '@/components/ui/form-components/form-notification';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { usePessoa } from '@/hooks/usePessoa';
import { User, Tag, Phone } from 'lucide-react';
import { FileField } from '@/components/ui/form-components/file-field';
import { TextField } from '@/components/ui/form-components/text-field';
import { DateField } from '@/components/ui/form-components/date-field';
import { PhoneField } from '@/components/ui/form-components/phone-field';
import { Button } from '@/components/ui/button';

interface ProfileFormStepperProps {
  onFinish: () => void;
  onBack?: () => void;
}

export function ProfileFormStepper({ onFinish, onBack }: ProfileFormStepperProps) {
  const { usuario } = useAuth();
  const [form, setForm] = useState({
    pesNome: '',
    pesApelido: '',
    pesDatanascimento: '',
    pesTelefone1: '',
    pesImagemperfil: undefined as File | string | undefined,
    pesImagemCapaPerfil: undefined as File | string | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Fotos, 2: Dados pessoais

  // Validação dos campos obrigatórios
  const isFormValid = !!form.pesNome && !!form.pesApelido && !!form.pesDatanascimento;
  const { setPessoa } = usePessoa();

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Se estamos na etapa 1, apenas avançar para a etapa 2
    if (step === 1) {
      setStep(2);
      return;
    }

    // Validar campos obrigatórios
    if (!form.pesNome || !form.pesApelido || !form.pesDatanascimento) {
      FormNotification.warning({
        message: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    setLoading(true);
    try {
      let pesImagemperfil = '';
      let pesImagemCapaPerfil = '';

      // Processar as imagens
      if (form.pesImagemperfil instanceof File) {
        pesImagemperfil = await fileToBase64(form.pesImagemperfil);
      } else if (typeof form.pesImagemperfil === 'string') {
        pesImagemperfil = form.pesImagemperfil;
      }

      if (form.pesImagemCapaPerfil instanceof File) {
        pesImagemCapaPerfil = await fileToBase64(form.pesImagemCapaPerfil);
      } else if (typeof form.pesImagemCapaPerfil === 'string') {
        pesImagemCapaPerfil = form.pesImagemCapaPerfil;
      }

      // Criar o payload para a API
      const payload = {
        pesNome: form.pesNome,
        pesApelido: form.pesApelido,
        pesDatanascimento: form.pesDatanascimento,
        pesTelefone1: form.pesTelefone1 || '',
        pesImagemperfil: pesImagemperfil || '',
        pesImagemCapaPerfil: pesImagemCapaPerfil || '',
        usuId: usuario?.usuId,
      };

      // Enviar para a API
      const pessoa = await pessoaService.createPessoa(payload);
      setPessoa(pessoa);

      // Notificar sucesso
      FormNotification.success({
        message: 'Perfil criado com sucesso! Bem-vindo(a) ao Rota Futuro!',
      });

      // Aguardar um pouco para o usuário ver a mensagem
      setTimeout(() => {
        onFinish();
      }, 1200);
    } catch (err) {
      console.error('Erro ao criar perfil:', err);
      FormNotification.error({
        message: 'Erro ao salvar perfil. Por favor, verifique os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col px-4 sm:px-6 md:px-0">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 py-6 sm:py-8 md:py-10 px-4 sm:px-6 rounded-t-xl text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 rounded-full w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
            Criar Seu Perfil
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Complete suas informações para finalizar o processo
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-b-xl overflow-hidden">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 md:p-10">
            {/* Indicador de progresso */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-sm md:text-base font-medium ${
                    step === 1
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Imagens de Perfil
                </span>
                <span
                  className={`text-sm md:text-base font-medium ${
                    step === 2
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Informações Pessoais
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 md:h-3">
                <div
                  className="h-2.5 md:h-3 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style={{ width: `${step * 50}%` }}
                ></div>
              </div>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Personalize seu perfil
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
                  Adicione uma foto de perfil e uma imagem de capa para personalizar seu perfil.
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <FileField
                      label="Imagem de Capa"
                      accept="image/*"
                      onlyImages={true}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, pesImagemCapaPerfil: e.target.files?.[0] }))
                      }
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Recomendado: 1200 x 400 pixels
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <FileField
                      label="Foto de Perfil"
                      accept="image/*"
                      onlyImages={true}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, pesImagemperfil: e.target.files?.[0] }))
                      }
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Recomendado: formato quadrado
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Informações Pessoais
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
                  Preencha seus dados pessoais para concluir o cadastro.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="col-span-1">
                    <TextField
                      label="Nome"
                      name="pesNome"
                      value={form.pesNome}
                      onChange={(e) => setForm((f) => ({ ...f, pesNome: e.target.value }))}
                      required
                      icon={User}
                      iconColor="text-blue-500"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div className="col-span-1">
                    <TextField
                      label="Apelido"
                      name="pesApelido"
                      value={form.pesApelido}
                      onChange={(e) => setForm((f) => ({ ...f, pesApelido: e.target.value }))}
                      required
                      icon={Tag}
                      iconColor="text-pink-500"
                      placeholder="Como prefere ser chamado?"
                    />
                  </div>
                  <div className="col-span-1">
                    <DateField
                      label="Data de Nascimento"
                      name="pesDatanascimento"
                      value={form.pesDatanascimento}
                      onChange={(date) => setForm((f) => ({ ...f, pesDatanascimento: date || '' }))}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <PhoneField
                      label="Telefone"
                      name="pesTelefone1"
                      value={form.pesTelefone1}
                      onChange={(e) => setForm((f) => ({ ...f, pesTelefone1: e.target.value }))}
                      icon={Phone}
                      iconColor="text-cyan-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  * Campos obrigatórios
                </p>
              </div>
            )}
          </div>

          {/* Botões de navegação */}
          <div className="p-5 sm:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              {step === 1 ? (
                <>
                  {onBack && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 text-gray-600 w-full sm:w-auto"
                      onClick={onBack}
                      size="sm"
                    >
                      Voltar
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    onClick={() => setStep(2)}
                    size="sm"
                  >
                    Próxima Etapa
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-600 w-full sm:w-32 md:w-36"
                    onClick={() => setStep(1)}
                    size="default"
                  >
                    Anterior
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-48 md:w-56"
                    disabled={loading || !isFormValid}
                    size="default"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      'Finalizar Cadastro'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
