'use client';
import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { BookOpen, Layers, Tag } from 'lucide-react';
import { Curso } from '../../../../types/curso';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { cursoService } from '@/services/curso/CursoService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';

interface CursoFormProps {
  curso?: Curso;
  onClose?: () => void;
}

export default function CursoForm({ curso, onClose }: CursoFormProps) {
  const initialState: Partial<Curso> = {
    curDescricao: '',
    area: undefined,
    areaSub: undefined,
    curAtivo: true,
  };
  const [form, setForm] = useState<Partial<Curso>>(initialState);
  const { error, success } = FormNotification;

  React.useEffect(() => {
    if (curso) {
      setForm({ ...curso });
    } else {
      setForm(initialState);
    }
  }, [curso]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.curId) {
        await cursoService.update(form.curId, form);
        success({ message: 'Curso atualizado!' });
      } else {
        await cursoService.create(form);
        success({ message: 'Curso criado!' });
      }
      if (onClose) onClose();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar curso.' });
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto bg-white p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-blue-700 text-center tracking-tight mb-2 flex items-center justify-center gap-2">
        <BookOpen className="w-7 h-7 text-blue-500" />
        {form.curId ? 'Editar Curso' : 'Cadastro de Curso'}
      </h2>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="curAtivo"
              name="curAtivo"
              checked={form.curAtivo ?? true}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="curAtivo" className="text-zinc-700 font-medium select-none cursor-pointer">
              Curso Ativo
            </label>
          </div>
          <TextField
            name="curDescricao"
            type="text"
            label={<span className="font-medium text-zinc-700">Descrição</span>}
            value={form.curDescricao || ''}
            onChange={handleChange}
            required
            icon={Tag}
            iconColor="text-blue-400"
            placeholder="Digite o nome do curso"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutoCompleteField
              name="area"
              label={<span className="font-medium text-zinc-700">Área</span>}
              value={form.area ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, area: Number(value) }))}
              fetchOptions={async (query) => {
                const areas = await areaService.search(query);
                return areas.map((a: any) => ({ value: Number(a.id ?? a.value ?? a.areaId), label: a.nome ?? a.label ?? a.areaNome ?? a.areaDescricao }));
              }}
              required
            />
            <AutoCompleteField
              name="areaSub"
              label={<span className="font-medium text-zinc-700">Subárea</span>}
              value={form.areaSub ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, areaSub: Number(value) }))}
              fetchOptions={async (query) => {
                const subs = await areaSubService.search(query);
                return subs.map((s: any) => ({ value: Number(s.id ?? s.value ?? s.areaSubId ?? s.areasId), label: s.nome ?? s.label ?? s.areaSubNome ?? s.areasDescricao }));
              }}
              required={false}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <button
            type="button"
            className="px-6 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold border border-zinc-300 hover:bg-zinc-200 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
           
