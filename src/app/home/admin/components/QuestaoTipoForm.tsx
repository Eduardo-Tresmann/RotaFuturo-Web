

import React, { useState, useEffect } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questaoTipoService, TipoQuestao } from '@/services/questao/QuestaoTipoService';

export default function QuestaoTipoForm({ onSuccess, data }: { onSuccess?: () => void, data?: Partial<TipoQuestao> }) {
  const [form, setForm] = useState<Partial<TipoQuestao>>(data ?? { quetDescricao: '' });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, quetDescricao: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.quetId) {
        await questaoTipoService.update(form.quetId, form);
        success({ message: 'Tipo de Questão atualizado!' });
      } else {
        await questaoTipoService.create(form);
        success({ message: 'Tipo de Questão salvo!' });
      }
      setForm({ quetDescricao: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar Tipo de Questão' });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextField
        name="quetDescricao"
        type="text"
        label={<span>Descrição do Tipo</span>}
        value={form.quetDescricao || ''}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
      >
        Salvar Tipo
      </button>
    </form>
  );
}
