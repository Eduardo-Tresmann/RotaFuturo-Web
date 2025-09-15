'use client';
import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { Questionario } from '../../../../types/questionario';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questionarioService } from '@/services/questionario/QuestionarioService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';

const initialState: Partial<Questionario> = {
  quesDescricao: '',
  quesPeso: 0,
  questionarioTipo: 0,
  area: 0,
  areaSub: 0,
};

interface QuestionarioFormProps {
  onSuccess?: () => void;
  data?: Partial<Questionario>;
}

export default function QuestionarioForm({ onSuccess, data }: QuestionarioFormProps) {
  // Normaliza para sempre usar o objeto do backend (questId, questDescricao)
  function normalizeTipo(tipo: any) {
    if (!tipo) return undefined;
    if (tipo.questId && tipo.questDescricao) return tipo;
    return undefined;
  }

  const [form, setForm] = useState<Partial<Questionario>>({
    ...data,
    questionarioTipo: normalizeTipo(data?.questionarioTipo),
    quesDescricao: data?.quesDescricao || '',
    quesPeso: data?.quesPeso,
    area: data?.area,
    areaSub: data?.areaSub,
  });
  const { error, success } = FormNotification;

  React.useEffect(() => {
    if (data) {
      setForm({
        ...data,
        questionarioTipo: normalizeTipo(data.questionarioTipo),
      });
    }
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Monta o payload conforme o backend espera
      const payload: any = {
        quesDescricao: form.quesDescricao,
        quesPeso: Number(form.quesPeso),
        quesAtivo: form.quesAtivo !== undefined ? form.quesAtivo : true,
        questionarioTipo: form.questionarioTipo?.questId ? { questId: form.questionarioTipo.questId } : undefined,
        area: form.area ? { areaId: form.area } : undefined,
        areaSub: form.areaSub ? { areasId: form.areaSub } : undefined,
        quesDatacadastro: form.quesDatacadastro,
        quesHoracadastro: form.quesHoracadastro,
      };
      if (form.quesId) {
        await questionarioService.update(form.quesId, payload);
        success({ message: 'Questionário atualizado!' });
      } else {
        await questionarioService.create(payload);
        success({ message: 'Questionário salvo!' });
      }
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar questionário' });
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-8 text-center">
        {form.quesId ? 'Editar Questionário' : 'Cadastro de Questionário'}
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <TextField
            name="quesDescricao"
            type="text"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Descrição</span>}
            value={form.quesDescricao || ''}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="quesPeso"
            type="number"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Peso</span>}
            value={form.quesPeso || ''}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="questionarioTipo"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Tipo de Questionário</span>}
            value={form.questionarioTipo?.questId || ''}
            onChange={async (value) => {
              // Busca o objeto completo ao selecionar
              const tipos = await import('@/services/questionario/QuestionarioTipoService').then(m => m.questionarioTipoService.listAll());
              const tipoObj = tipos.find(t => t.questId === value);
              setForm((prev) => ({ ...prev, questionarioTipo: tipoObj }));
            }}
            fetchOptions={async (query) => {
              const tipos = await import('@/services/questionario/QuestionarioTipoService').then(m => m.questionarioTipoService.search(query));
              return tipos.map(t => ({ value: t.questId, label: t.questDescricao }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="area"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Área</span>}
            value={form.area}
            onChange={(value) => setForm((prev) => ({ ...prev, area: Number(value) }))}
            fetchOptions={async (query) => {
              const areas = await areaService.search(query);
              return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="areaSub"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Sub Área</span>}
            value={form.areaSub}
            onChange={(value) => setForm((prev) => ({ ...prev, areaSub: Number(value) }))}
            fetchOptions={async (query: string) => {
              const subs = await areaSubService.search(query);
              return subs.map((s: any) => ({ value: s.areasId, label: s.areasDescricao }));
            }}
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-3 flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
