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
  // Validação dos campos obrigatórios
  const isFormValid =
    !!form.pesNome &&
    !!form.pesApelido &&
    !!form.pesDatanascimento;
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
    setLoading(true);
    try {
      let pesImagemperfil = '';
      let pesImagemCapaPerfil = '';
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
      const payload = {
        pesNome: form.pesNome,
        pesApelido: form.pesApelido,
        pesDatanascimento: form.pesDatanascimento,
        pesTelefone1: form.pesTelefone1,
        pesImagemperfil: pesImagemperfil || '',
        pesImagemCapaPerfil: pesImagemCapaPerfil || '',
        usuId: usuario?.usuId,
      };
      const pessoa = await pessoaService.createPessoa(payload);
      setPessoa(pessoa);
      FormNotification.success({ message: 'Perfil salvo com sucesso!' });
      setTimeout(() => {
        onFinish();
      }, 1200);
    } catch (err) {
  FormNotification.error({ message: 'Erro ao salvar perfil. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-[80vh] min-h-[400px] justify-between">
  <div className="w-full flex flex-col flex-1 max-w-3xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 h-full">
        <form
          className="flex flex-col gap-8 flex-1 h-full"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-zinc-800 mb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" /> Criar Perfil
            </h1>
           
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileField
                  label="Imagem de Capa"
                  accept="image/*"
                  onlyImages={true}
                  onChange={(e) => setForm((f) => ({ ...f, pesImagemCapaPerfil: e.target.files?.[0] }))}
                />
                <FileField
                  label="Foto de Perfil"
                  accept="image/*"
                  onlyImages={true}
                  onChange={(e) => setForm((f) => ({ ...f, pesImagemperfil: e.target.files?.[0] }))}
                />
              </div>
            </div>
            {/* Seção de informações pessoais */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-zinc-700 mb-4">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <DateField
                  label="Data de Nascimento"
                  name="pesDatanascimento"
                  value={form.pesDatanascimento}
                  onChange={(date) => setForm((f) => ({ ...f, pesDatanascimento: date || '' }))}
                  required
                />
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
              <p className="text-xs text-zinc-500 mt-4">* Campos obrigatórios</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 mt-auto w-full">
            {onBack && (
              <Button
                type="button"
                
                className="w-36 px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded shadow hover:bg-gray-300 transition text-base"
                onClick={onBack}
              >
                Voltar
              </Button>
            )}
            <Button
              type="submit"
              className="w-36 px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition text-base"
              disabled={loading || !isFormValid}
            >
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
