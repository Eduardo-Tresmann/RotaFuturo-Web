import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questaoNivelService, NivelQuestao } from '@/services/questao/QuestaoNivelService';


export default function QuestaoNivelForm({ onSuccess, data }: { onSuccess?: () => void, data?: Partial<NivelQuestao> }) {
  const [form, setForm] = useState<Partial<NivelQuestao>>(data ?? { quesnDescricao: '' });

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, quesnDescricao: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.quesnId) {
        await questaoNivelService.update(form.quesnId, form);
        success({ message: 'Nível de Questão atualizado!' });
      } else {
        await questaoNivelService.create(form);
        success({ message: 'Nível de Questão salvo!' });
      }
      setForm({ quesnDescricao: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar Nível de Questão' });
    }
  }

  return (
    <form className="flex flex-col gap-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl max-w-lg mx-auto shadow-soft" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2 text-center">
        {form.quesnId ? 'Editar Nível de Questão' : 'Cadastro de Nível de Questão'}
      </h2>
      <TextField
        name="quesnDescricao"
        type="text"
        label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Descrição do Nível</span>}
        value={form.quesnDescricao || ''}
        onChange={handleChange}
        required
        className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Salvar Nível
      </button>
    </form>
  );
}
