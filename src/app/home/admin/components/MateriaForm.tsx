'use client';
import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { BookOpen, Layers, Tag } from 'lucide-react';
import { Materia } from '../../../../types/materia';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { materiaService } from '@/services/materia/MateriaService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';

interface MateriaFormProps {
  materia?: Materia;
  onClose?: () => void;
}

export default function MateriaForm({ materia, onClose }: MateriaFormProps) {
  const initialState: Partial<Materia> = {
    matDescricao: '',
    area: undefined,
    areaSub: undefined,
  };
  const [form, setForm] = useState<Partial<Materia>>(initialState);
  const { error, success } = FormNotification;

  React.useEffect(() => {
    if (materia) {
      setForm({ ...materia });
    } else {
      setForm(initialState);
    }
  }, [materia]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Monta payload apenas com os ids de área e subárea
      const payload: any = {
        ...form,
        area: form.area?.areaId ?? form.area,
        areaSub: form.areaSub?.areasId ?? form.areaSub,
      };
      if (form.matId) {
        await materiaService.update(form.matId, payload);
        success({ message: 'Matéria atualizada!' });
      } else {
        await materiaService.create(payload);
        success({ message: 'Matéria criada!' });
      }
      if (onClose) onClose();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar matéria.' });
    }
  }

  return (
  <section className="w-full max-w-2xl mx-auto bg-white p-8 flex flex-col gap-8" style={{borderBottom: 'none'}}>
      <h2 className="text-2xl font-bold text-blue-700 text-center tracking-tight mb-2 flex items-center justify-center gap-2">
        <Layers className="w-7 h-7 text-blue-500" />
        {form.matId ? 'Editar Matéria' : 'Cadastro de Matéria'}
      </h2>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <TextField
            name="matDescricao"
            type="text"
            label={<span className="font-medium text-zinc-700">Descrição</span>}
            value={form.matDescricao || ''}
            onChange={handleChange}
            required
            icon={Tag}
            iconColor="text-blue-400"
            placeholder="Digite o nome da matéria"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutoCompleteField
              name="area"
              label={<span className="font-medium text-zinc-700">Área</span>}
              value={form.area?.areaId ?? ''}
              onChange={async (value) => {
                const areas = await areaService.listAll();
                const areaObj = areas.find(a => a.areaId === Number(value));
                setForm((prev) => ({ ...prev, area: areaObj }));
              }}
              fetchOptions={async (query) => {
                const areas = await areaService.search(query);
                return areas.map((a: any) => ({ value: Number(a.areaId), label: a.areaDescricao }));
              }}
              required
            />
            <AutoCompleteField
              name="areaSub"
              label={<span className="font-medium text-zinc-700">Subárea</span>}
              value={form.areaSub?.areasId ?? ''}
              onChange={async (value) => {
                const subs = await areaSubService.listAll();
                const subObj = subs.find(s => s.areasId === Number(value));
                setForm((prev) => ({ ...prev, areaSub: subObj }));
              }}
              fetchOptions={async (query) => {
                const subs = await areaSubService.search(query);
                return subs.map((s: any) => ({ value: Number(s.areasId), label: s.areasDescricao }));
              }}
              required
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
