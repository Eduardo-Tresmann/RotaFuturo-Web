'use client';
import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { Tag } from 'lucide-react';
import { Area } from '../../../../types/area';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { areaService } from '@/services/area/AreaService';
const initialState: Partial<Area> = {
  areaDescricao: '',
};
interface AreaFormProps {
  onCreated?: () => void;
  area?: Area | null;
}
export default function AreaForm({ onCreated, area }: AreaFormProps) {
  const [form, setForm] = useState<Partial<Area>>({
    areaDescricao: area?.areaDescricao || '',
    areaId: area?.areaId,
  });
  const { error, success } = FormNotification;
  React.useEffect(() => {
    setForm({
      areaDescricao: area?.areaDescricao || '',
      areaId: area?.areaId,
    });
  }, [area]);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.areaDescricao || !form.areaDescricao.trim()) {
      error({ message: 'Preencha a descrição da área.' });
      return;
    }
    try {
      if (form.areaId) {
        await areaService.update(form.areaId, form);
        success({ message: 'Área atualizada!' });
      } else {
        await areaService.create(form);
        success({ message: 'Área salva!' });
      }
      setForm(initialState);
      if (onCreated) onCreated();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar área' });
    }
  }
  return (
    <section className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-white text-center">{form.areaId ? 'Editar Área' : 'Cadastro de Área'}</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          name="areaDescricao"
          type="text"
          label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Descrição da Área</span>}
          value={form.areaDescricao || ''}
          onChange={handleChange}
          required
          icon={Tag}
          iconColor="text-blue-500"
          placeholder="Digite o nome da área..."
          className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400 pl-10"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white rounded shadow dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-white px-4 py-2 transition-colors disabled:opacity-60"
          >
            {form.areaId ? 'Salvar Alterações' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  );
}
