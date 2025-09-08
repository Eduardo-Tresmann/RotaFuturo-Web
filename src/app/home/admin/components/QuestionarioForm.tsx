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
  // Normaliza o tipo para sempre ter id/descricao
  function normalizeTipo(tipo: any) {
    if (!tipo) return undefined;
    if (tipo.id && tipo.descricao) return tipo;
    if (tipo.questId && tipo.questDescricao) return { id: tipo.questId, descricao: tipo.questDescricao, ativo: tipo.questAtivo };
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
        questionarioTipo: form.questionarioTipo?.id ? { questId: form.questionarioTipo.id } : undefined,
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
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
        {form.quesId ? 'Editar Questionário' : 'Cadastro de Questionário'}
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <TextField
            name="quesDescricao"
            type="text"
            label={<span>Descrição</span>}
            value={form.quesDescricao || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="quesPeso"
            type="number"
            label="Peso"
            value={form.quesPeso || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
              name="questionarioTipo"
              label="Tipo de Questionário"
              value={form.questionarioTipo?.id || ''}
              onChange={async (value) => {
                // Busca o objeto completo ao selecionar
                const tipos = await import('@/services/questionario/QuestionarioTipoService').then(m => m.questionarioTipoService.listAll());
                const tipoObj = tipos.find(t => t.id === value);
                setForm((prev) => ({ ...prev, questionarioTipo: tipoObj }));
              }}
              fetchOptions={async (query) => {
                const tipos = await import('@/services/questionario/QuestionarioTipoService').then(m => m.questionarioTipoService.listAll());
                return tipos
                  .filter(t => t.descricao && t.descricao.toLowerCase().includes(query.toLowerCase()))
                  .map(t => ({ value: t.id, label: t.descricao }));
              }}
              required
            />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="area"
            label="Área"
            value={form.area}
            onChange={(value) => setForm((prev) => ({ ...prev, area: Number(value) }))}
            fetchOptions={async (query) => {
              const areas = await areaService.search(query);
              return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
            }}
            required
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="areaSub"
            label="Sub Área"
            value={form.areaSub}
            onChange={(value) => setForm((prev) => ({ ...prev, areaSub: Number(value) }))}
            fetchOptions={async (query: string) => {
              const subs = await areaSubService.search(query);
              return subs.map((s: any) => ({ value: s.areasId, label: s.areasDescricao }));
            }}
            required
          />
        </div>
        <div className="md:col-span-3 flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
