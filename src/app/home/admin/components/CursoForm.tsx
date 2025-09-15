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
    if (!form.curDescricao || !form.curDescricao.trim()) {
      error({ message: 'Preencha a descrição do curso.' });
      return;
    }
    if (!form.area) {
      error({ message: 'Selecione uma área.' });
      return;
    }
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
    <section className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-900 p-8 flex flex-col gap-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center tracking-tight mb-2 flex items-center justify-center gap-2">
        <BookOpen className="w-7 h-7 text-blue-500 dark:text-blue-400" />
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
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500"
            />
            <label htmlFor="curAtivo" className="text-zinc-700 dark:text-zinc-200 font-medium select-none cursor-pointer">
              Curso Ativo
            </label>
          </div>
          <TextField
            name="curDescricao"
            type="text"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Descrição</span>}
            value={form.curDescricao || ''}
            onChange={handleChange}
            required
            icon={Tag}
            iconColor="text-blue-400"
            placeholder="Digite o nome do curso"
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400 pl-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutoCompleteField
              name="area"
              label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Área</span>}
              value={form.area ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, area: Number(value) }))}
              fetchOptions={async (query) => {
                const areas = await areaService.search(query);
                return areas.map((a: any) => ({ value: Number(a.id ?? a.value ?? a.areaId), label: a.nome ?? a.label ?? a.areaNome ?? a.areaDescricao }));
              }}
              required
              inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
            />
            <AutoCompleteField
              name="areaSub"
              label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Subárea</span>}
              value={form.areaSub ?? ''}
              onChange={(value) => setForm((prev) => ({ ...prev, areaSub: Number(value) }))}
              fetchOptions={async (query) => {
                const subs = await areaSubService.search(query);
                return subs.map((s: any) => ({ value: Number(s.id ?? s.value ?? s.areaSubId ?? s.areasId), label: s.nome ?? s.label ?? s.areaSubNome ?? s.areasDescricao }));
              }}
              required={false}
              inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <button
            type="button"
            className="px-6 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold border border-zinc-300 hover:bg-zinc-200 transition dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition dark:bg-blue-800 dark:hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}

