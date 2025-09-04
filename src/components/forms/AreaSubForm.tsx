'use client';
import React, { useState } from 'react';
import { TextField } from '../ui/form-components/text-field';
import { AutoCompleteField } from '../ui/form-components/autocomplete-field';
import { areaService } from '@/services/area/AreaService';
import { AreaSub } from '../../types/areasub';
import { FormNotification } from '../ui/form-components/form-notification';
import { areaSubService } from '@/services/areasub/AreaSubService';

const initialState: Partial<AreaSub> = {
  areasDescricao: '',
  areaId: undefined,
};

export default function AreaSubForm() {
  const [form, setForm] = useState<Partial<AreaSub>>({
    areasDescricao: '',
    areaId: undefined,
  });
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await areaSubService.create(form);
      success({ message: 'Sub Área salva!' });
      setForm(initialState);
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar sub área' });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Cadastro de Sub Área</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <TextField
            name="areasDescricao"
            type="text"
            label={<span>Descrição</span>}
            value={form.areasDescricao || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <AutoCompleteField
            name="areaId"
            label={
              <span>
                Área <span className="text-red-500">*</span>
              </span>
            }
            value={form.areaId}
            required
            fetchOptions={async (query) => {
              const areas = await areaService.search(query);
              return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
            }}
            onChange={(value) => setForm((prev) => ({ ...prev, areaId: Number(value) }))}
          />
        </div>
        <div className="md:col-span-2 flex justify-end mt-8">
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
