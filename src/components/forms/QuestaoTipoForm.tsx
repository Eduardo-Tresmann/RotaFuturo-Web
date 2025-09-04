import React, { useState } from 'react';
import { TextField } from '../ui/form-components/text-field';
import { FormNotification } from '../ui/form-components/form-notification';
// Adapte o tipo conforme seu backend
export interface QuestaoTipo {
  quetId?: number;
  quetDescricao: string;
}

export default function QuestaoTipoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<Partial<QuestaoTipo>>({ quetDescricao: '' });
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, quetDescricao: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: Chamar o service para criar QuestaoTipo
      // await questaoTipoService.create(form);
      success({ message: 'Questão Tipo salva!' });
      setForm({ quetDescricao: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar Questão Tipo' });
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
        className="bg-purple-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-purple-700 transition"
      >
        Salvar Tipo
      </button>
    </form>
  );
}
