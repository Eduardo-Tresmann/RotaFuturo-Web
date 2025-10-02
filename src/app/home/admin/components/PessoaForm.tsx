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
    <section className="w-full max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl p-6 flex flex-col gap-6 shadow-soft">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-blue-300 text-center">{form.pesId ? 'Editar Pessoa' : 'Cadastro de Pessoa'}</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Nome</span>}
            name="pesNome"
            value={form.pesNome || ''}
            onChange={handleChange}
            required
            icon={User}
            iconColor="text-blue-500"
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg pl-10 py-2 transition-colors dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
          <TextField
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Apelido</span>}
            name="pesApelido"
            value={form.pesApelido || ''}
            onChange={handleChange}
            icon={Tag}
            iconColor="text-pink-500"
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg pl-10 py-2 transition-colors dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateField
            label="Data de Nascimento"
            name="pesDatanascimento"
            value={form.pesDatanascimento || ''}
            onChange={date => setForm(f => ({ ...f, pesDatanascimento: date || undefined }))}
            required
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg px-10 py-2 transition-colors dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
          <div>
            <label className="font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">Telefone</label>
            <PhoneField
              name="pesTelefone1"
              value={form.pesTelefone1 || ''}
              onChange={handleChange}
              icon={Phone}
              iconColor="text-cyan-500"
              className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg px-10 py-2 transition-colors dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutoCompleteField
            name="usuId"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Vincular Usuário (e-mail)</span>}
            value={form.usuId}
            onChange={usuId => setForm(f => ({ ...f, usuId: typeof usuId === 'string' ? Number(usuId) : usuId }))}
            fetchOptions={async (query) => {
              const usuarios = await usuarioService.listAll();
              return usuarios
                .filter(u => u.usuEmail.toLowerCase().includes(query.toLowerCase()))
                .map(u => ({ value: u.usuId, label: u.usuEmail }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="flex justify-end mt-2 gap-4">
          {onClose && (
            <button
              type="button"
              className="rounded border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:bg-neutral-800/70 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-700 px-4 py-2 transition-colors disabled:opacity-60"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="bg-neutral-700 hover:bg-neutral-600 text-white rounded shadow dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white px-4 py-2 transition-colors disabled:opacity-60"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
