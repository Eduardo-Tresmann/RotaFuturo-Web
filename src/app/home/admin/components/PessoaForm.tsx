import React, { useState, useEffect } from 'react';
import { TextField } from '@/components/ui/form-components/text-field';
import { DateField } from '@/components/ui/form-components/date-field';
import { PhoneField } from '@/components/ui/form-components/phone-field';
import { User, Tag, Phone } from 'lucide-react';
import { Pessoa } from '@/types/pessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { AutoCompleteField } from '@/components/ui/form-components/autocomplete-field';
import { usuarioService } from '@/services/usuario/UsuarioService';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onClose?: () => void;
  onSaved?: () => void;
}

const initialState: Partial<Pessoa> = {
  pesNome: '',
  pesApelido: '',
  pesDatanascimento: '',
  pesTelefone1: '',
  pesTelefone2: '',
  pesNivel: 0,
  pesXp: 0,
  pesImagemperfil: '',
  pesImagemCapaPerfil: '',
  pesImagemcurriculo: '',
  usuId: undefined,
};

export default function PessoaForm({ pessoa, onClose, onSaved }: PessoaFormProps) {
  const [form, setForm] = useState<Partial<Pessoa>>(initialState);
  const { error, success } = FormNotification;

  useEffect(() => {
    if (pessoa) {
      setForm({ ...pessoa });
    } else {
      setForm(initialState);
    }
  }, [pessoa]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.pesId) {
        await pessoaService.updatePessoa(form.pesId, form);
        success({ message: 'Pessoa atualizada!' });
      } else {
        await pessoaService.createPessoa(form);
        success({ message: 'Pessoa criada!' });
      }
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar pessoa.' });
    }
  }

  return (
    <section className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-zinc-800 text-center">{form.pesId ? 'Editar Pessoa' : 'Cadastro de Pessoa'}</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Nome"
            name="pesNome"
            value={form.pesNome || ''}
            onChange={handleChange}
            required
            icon={User}
            iconColor="text-blue-500"
          />
          <TextField
            label="Apelido"
            name="pesApelido"
            value={form.pesApelido || ''}
            onChange={handleChange}
            icon={Tag}
            iconColor="text-pink-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateField
            label="Data de Nascimento"
            name="pesDatanascimento"
            value={form.pesDatanascimento || ''}
            onChange={date => setForm(f => ({ ...f, pesDatanascimento: date || undefined }))}
            required
          />
          <PhoneField
            label="Telefone"
            name="pesTelefone1"
            value={form.pesTelefone1 || ''}
            onChange={handleChange}
            icon={Phone}
            iconColor="text-cyan-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutoCompleteField
            name="usuId"
            label="Vincular Usuário (e-mail)"
            value={form.usuId}
            onChange={usuId => setForm(f => ({ ...f, usuId: typeof usuId === 'string' ? Number(usuId) : usuId }))}
            fetchOptions={async (query) => {
              const usuarios = await usuarioService.listAll();
              return usuarios
                .filter(u => u.usuEmail.toLowerCase().includes(query.toLowerCase()))
                .map(u => ({ value: u.usuId, label: u.usuEmail }));
            }}
            required
          />
        </div>
        <div className="flex justify-end mt-2 gap-4">
          {onClose && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 rounded-xl px-8 py-3 font-bold shadow hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
