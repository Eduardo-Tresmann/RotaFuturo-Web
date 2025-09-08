'use client';
import React, { useState, useEffect } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { Tag } from 'lucide-react';
import { areaService } from '@/services/area/AreaService';
import { AreaSub } from '../../../../types/areasub';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { areaSubService } from '@/services/areasub/AreaSubService';

const initialState: Partial<AreaSub> = {
  areasDescricao: '',
  areaId: undefined,
};

type AreaSubFormProps = {
  subarea?: AreaSub | null;
  onCreated?: () => void;
};

export default function AreaSubForm({ subarea, onCreated }: AreaSubFormProps) {
  const [form, setForm] = useState<Partial<AreaSub>>(
    subarea
      ? {
          areasDescricao: subarea.areasDescricao,
          areaId: subarea.areaId,
          areasId: subarea.areasId,
        }
      : { areasDescricao: '', areaId: undefined }
  );
  const [areaOptions, setAreaOptions] = useState<{ value: number; label: string }[]>([]);

  // Sempre carrega a opção da área vinculada ao editar
  useEffect(() => {
    async function fetchInitialArea() {
      if (form.areaId) {
        const area = await areaService.listAll();
        const found = area.find(a => a.areaId === form.areaId);
        if (found) {
          setAreaOptions([{ value: found.areaId, label: found.areaDescricao }]);
        }
      }
    }
    fetchInitialArea();
  }, [form.areaId]);
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.areasId) {
        // Só envia os campos editáveis: descrição e vínculo
        await areaSubService.update(form.areasId, {
          areasDescricao: form.areasDescricao,
          areaId: form.areaId,
        });
        success({ message: 'Sub Área atualizada!' });
      } else {
        await areaSubService.create(form);
        success({ message: 'Sub Área salva!' });
        setForm(initialState);
      }
      if (onCreated) onCreated();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar sub área' });
    }
  }

  return (
    <section className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-zinc-800 text-center">Cadastro de SubÁrea</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          name="areasDescricao"
          type="text"
          label={<span className="font-medium text-zinc-700">Descrição da SubÁrea</span>}
          value={form.areasDescricao || ''}
          onChange={handleChange}
          required
          icon={Tag}
          iconColor="text-blue-500"
          placeholder="Digite o nome da subárea..."
        />
        <AutoCompleteField
          name="areaId"
          label={<span className="font-medium text-zinc-700">Área</span>}
          value={form.areaId ?? ''}
          required
          fetchOptions={async (query) => {
            const areas = await areaService.search(query);
            let opts = areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
            // Garante que a área vinculada esteja sempre nas opções
            if (form.areaId && !opts.some(opt => opt.value === form.areaId)) {
              // Busca a área vinculada se não estiver nas opções
              const all = await areaService.listAll();
              const found = all.find(a => a.areaId === form.areaId);
              if (found) {
                opts = [{ value: found.areaId, label: found.areaDescricao }, ...opts];
              }
            }
            return opts;
          }}
          onChange={(value) => setForm((prev) => ({ ...prev, areaId: Number(value) }))}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
