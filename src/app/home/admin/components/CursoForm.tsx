'use client';
import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { Curso } from '../../../../types/curso';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { cursoService } from '@/services/curso/CursoService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';

export default function CursoForm() {
  const [form, setForm] = useState<Partial<Curso>>({
    curDescricao: '',
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
      await cursoService.create(form);
      success({ message: 'Curso salvo!' });
      setForm({
        curDescricao: '',
        area: undefined,
        areaSub: undefined,
      });
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar curso' });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Cadastro de Curso</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <TextField
            name="curDescricao"
            type="text"
            label={<span>Descrição</span>}
            value={form.curDescricao || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="area"
            label={
              <span>
                Área <span className="text-red-500">*</span>
              </span>
            }
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
