'use client';
import React, { useState } from 'react';
import { TextField } from '../ui/form-components/text-field';
import { Area } from '../../types/area';
import { FormNotification } from '../ui/form-components/form-notification';
import { areaService } from '@/services/area/AreaService';

const initialState: Partial<Area> = {
  areaDescricao: '',
};

export default function AreaForm() {
  const [form, setForm] = useState<Partial<Area>>({
    areaDescricao: '',
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
      await areaService.create(form);
      success({ message: 'Área salva!' });
      setForm(initialState);
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar área' });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Cadastro de Área</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <TextField
            name="areaDescricao"
            type="text"
            label={<span>Descrição</span>}
            value={form.areaDescricao || ''}
            onChange={handleChange}
            required
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
