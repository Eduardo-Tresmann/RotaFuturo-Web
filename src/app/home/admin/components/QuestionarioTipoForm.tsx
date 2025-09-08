
import React, { useState, useEffect } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questionarioTipoService } from '@/services/questionario/QuestionarioTipoService';

export default function QuestionarioTipoForm({ onSuccess, data }: { onSuccess?: () => void, data?: any }) {
  const [form, setForm] = useState<{ id?: number; descricao: string; ativo: boolean }>(() => {
    if (data) {
      return {
        id: data.id ?? data.questId,
        descricao: data.descricao ?? data.questDescricao ?? '',
        ativo: typeof data.ativo === 'boolean' ? data.ativo : (typeof data.questAtivo === 'boolean' ? data.questAtivo : true),
      };
    }
    return { descricao: '', ativo: true };
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id ?? data.questId,
        descricao: data.descricao ?? data.questDescricao ?? '',
        ativo: typeof data.ativo === 'boolean' ? data.ativo : (typeof data.questAtivo === 'boolean' ? data.questAtivo : true),
      });
    }
  }, [data]);

  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, descricao: e.target.value }));
  }

  function handleAtivoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, ativo: e.target.checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Mapeia para o DTO esperado pelo backend
      const payload = {
        questDescricao: form.descricao,
        questAtivo: form.ativo,
      };
      if (form.id) {
        await questionarioTipoService.update(form.id, payload as any);
        success({ message: 'Tipo de Questionário atualizado!' });
      } else {
        await questionarioTipoService.create(payload as any);
        success({ message: 'Tipo de Questionário salvo!' });
      }
      setForm({ descricao: '', ativo: true });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar Tipo de Questionário' });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextField
        name="descricao"
        type="text"
        label={<span>Descrição do Tipo de Questionário</span>}
        value={form.descricao || ''}
        onChange={handleChange}
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.ativo ?? true}
          onChange={handleAtivoChange}
        />
        <span className="text-sm">Ativo</span>
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
      >
        Salvar Tipo
      </button>
    </form>
  );
}
