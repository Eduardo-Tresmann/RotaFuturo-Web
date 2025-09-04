'use client';
import React, { useState } from 'react';
import { TextField } from '../ui/form-components/text-field';
import { AutoCompleteField } from '../ui/form-components/autocomplete-field';
import { Questao } from '../../types/questao';
import { FormNotification } from '../ui/form-components/form-notification';
import { questaoService } from '@/services/questao/QuestaoService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';

export default function QuestaoForm() {
  const [form, setForm] = useState<Partial<Questao>>({
    questaoCodigo: '',
    questaoDescricao: '',
    questaoExperiencia: 0,
    questaoNivel: undefined,
    questaoTipo: undefined,
    area: undefined,
    areaSub: undefined,
  });
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Monta o payload correto para o backend
      const payload = {
        ...form,
        area: form.area ? { areaId: form.area } : undefined,
        areaSub: form.areaSub ? { areasId: form.areaSub } : undefined,
      };
      await questaoService.create(payload);
      success({ message: 'Questão salva!' });
      setForm({
        questaoCodigo: '',
        questaoDescricao: '',
        questaoExperiencia: 0,
        questaoNivel: undefined,
        questaoTipo: undefined,
        area: undefined,
        areaSub: undefined,
      });
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar questão' });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Cadastro de Questão</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-1">
          <TextField
            name="questaoCodigo"
            type="text"
            label={<span>Código</span>}
            value={form.questaoCodigo || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <TextField
            name="questaoDescricao"
            type="text"
            label={<span>Descrição</span>}
            value={form.questaoDescricao || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="questaoExperiencia"
            type="number"
            label={<span>Experiência</span>}
            value={form.questaoExperiencia || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="questaoNivel"
            type="number"
            label="Nível"
            value={form.questaoNivel || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="questaoTipo"
            type="number"
            label="Tipo"
            value={form.questaoTipo || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="area"
            label="Área"
            value={form.area}
            onChange={(value) => setForm((prev) => ({ ...prev, area: value }))}
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
            onChange={(value) => setForm((prev) => ({ ...prev, areaSub: value }))}
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
