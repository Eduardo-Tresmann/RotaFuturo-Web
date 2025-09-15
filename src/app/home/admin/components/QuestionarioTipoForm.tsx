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
    <form className="flex flex-col gap-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl max-w-lg mx-auto shadow-soft" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2 text-center">
        {form.id ? 'Editar Tipo de Questionário' : 'Cadastro de Tipo de Questionário'}
      </h2>
      <TextField
        name="descricao"
        type="text"
        label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Descrição do Tipo de Questionário</span>}
        value={form.descricao || ''}
        onChange={handleChange}
        required
        className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.ativo ?? true}
          onChange={handleAtivoChange}
          className="w-4 h-4 accent-blue-600 dark:accent-blue-500"
        />
        <span className="text-zinc-700 dark:text-zinc-200 font-medium select-none cursor-pointer text-sm">Ativo</span>
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Salvar Tipo
      </button>
    </form>
  );
}
