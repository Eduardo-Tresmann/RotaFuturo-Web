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
}

export function ProfileFormStepper({ onFinish }: ProfileFormStepperProps) {
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
      onFinish();
    } catch (err) {
      alert('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <form
        className="w-full max-w-2xl flex flex-col gap-8 mt-10 bg-white/90 rounded-2xl shadow-lg p-10 border-t border-x border-zinc-100"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-zinc-800 mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Criar Perfil
        </h1>
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
          <TextField
            label="Nome"
            name="pesNome"
            value={form.pesNome}
            onChange={(e) => setForm((f) => ({ ...f, pesNome: e.target.value }))}
            required
            icon={User}
            iconColor="text-blue-500"
          />
          <TextField
            label="Apelido"
            name="pesApelido"
            value={form.pesApelido}
            onChange={(e) => setForm((f) => ({ ...f, pesApelido: e.target.value }))}
            required
            icon={Tag}
            iconColor="text-pink-500"
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
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="submit"
            size="lg"
            className="bg-green-600 text-white rounded shadow"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </div>
      </form>
    </div>
  );
}
