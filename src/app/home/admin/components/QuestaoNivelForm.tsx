
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextField
  name="quesnDescricao"
        type="text"
        label={<span>Descrição do Nível</span>}
  value={form.quesnDescricao || ''}
  onChange={handleChange}
  required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
      >
        Salvar Nível
      </button>
    </form>
  );
}
