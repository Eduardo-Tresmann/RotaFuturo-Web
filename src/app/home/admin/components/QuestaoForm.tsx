'use client';
import React, { useState, useEffect } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { TextArea } from '../../../../components/ui/form-components/text-area';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { Questao } from '../../../../types/questao';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questaoService } from '@/services/questao/QuestaoService';
import { questaoTipoService, TipoQuestao } from '@/services/questao/QuestaoTipoService';
import { questaoNivelService, NivelQuestao } from '@/services/questao/QuestaoNivelService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { FormLabel } from '../../../../components/ui/form-components/form-label';

export default function QuestaoForm({ onSuccess, data }: { onSuccess?: () => void, data?: Partial<Questao> }) {
  const [form, setForm] = useState<Partial<Questao>>({
    questaoCodigo: data?.questaoCodigo || '',
    questaoDescricao: data?.questaoDescricao || '',
    questaoExperiencia: data?.questaoExperiencia,
    questaoNivel: data?.questaoNivel,
    questaoTipo: data?.questaoTipo,
    area: data?.area,
    areaSub: data?.areaSub,
    questaoId: data?.questaoId,
  });

  useEffect(() => {
    if (data) {
      setForm({
        questaoCodigo: data.questaoCodigo || '',
        questaoDescricao: data.questaoDescricao || '',
        questaoExperiencia: data.questaoExperiencia,
        questaoNivel: data.questaoNivel,
        questaoTipo: data.questaoTipo,
        area: data.area,
        areaSub: data.areaSub,
        questaoId: data.questaoId,
      });
    }
  }, [data]);
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Monta o payload correto para o backend
      const payload = {
        questaoCodigo: form.questaoCodigo,
        questaoDescricao: form.questaoDescricao,
        questaoExperiencia: form.questaoExperiencia ? Number(form.questaoExperiencia) : undefined,
        questaoTipo: form.questaoTipo || undefined,
        questaoNivel: form.questaoNivel || undefined,
        area: form.area ? { areaId: form.area } : undefined,
        areaSub: form.areaSub ? { areasId: form.areaSub } : undefined,
        // Garante que questaoAtivo seja enviado ao editar
        ...(form.questaoId && data ? {
          questaoDatacadastro: data.questaoDatacadastro,
          questaoHoracadastro: data.questaoHoracadastro,
          questaoAtivo: data.questaoAtivo,
        } : {}),
      };
      if (form.questaoId) {
        await questaoService.update(form.questaoId, payload);
        success({ message: 'Questão atualizada!' });
      } else {
        await questaoService.create(payload);
        success({ message: 'Questão salva!' });
      }
      setForm({
        questaoCodigo: '',
        questaoDescricao: '',
        questaoExperiencia: undefined,
        questaoNivel: undefined,
        questaoTipo: undefined,
        area: undefined,
        areaSub: undefined,
        questaoId: undefined,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar questão' });
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-8 mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-8 text-center">Cadastro de Questão</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-1">
          <TextField
            name="questaoCodigo"
            type="text"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Código</span>}
            value={form.questaoCodigo || ''}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-2">
          <FormLabel htmlFor="questaoDescricao" required>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Enunciado da Questão</span>
          </FormLabel>
          <TextArea
            id="questaoDescricao"
            name="questaoDescricao"
            value={form.questaoDescricao || ''}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <TextField
            name="questaoExperiencia"
            type="number"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Experiência</span>}
            value={form.questaoExperiencia || ''}
            onChange={handleChange}
            min={0}
            className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="questaoTipo"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Tipo de Questão</span>}
            value={form.questaoTipo}
            onChange={(value) => setForm((prev) => ({ ...prev, questaoTipo: value }))}
            fetchOptions={async (query) => {
              const tipos = await questaoTipoService.listAll();
              return tipos
                .filter((t) => t.quetDescricao.toLowerCase().includes(query.toLowerCase()))
                .map((t) => ({ value: t.quetId!, label: t.quetDescricao }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="questaoNivel"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Nível da Questão</span>}
            value={form.questaoNivel}
            onChange={(value) => setForm((prev) => ({ ...prev, questaoNivel: value }))}
            fetchOptions={async (query) => {
              const niveis = await questaoNivelService.listAll();
              return niveis
                .filter((n) => n.quesnDescricao.toLowerCase().includes(query.toLowerCase()))
                .map((n) => ({ value: n.quesnId!, label: n.quesnDescricao }));
            }}
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="area"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Área</span>}
            value={form.area}
            onChange={(value) => setForm((prev) => ({ ...prev, area: value }))}
            fetchOptions={async (query) => {
              const areas = await areaService.search(query);
              return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="areaSub"
            label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Sub Área</span>}
            value={form.areaSub}
            onChange={(value) => setForm((prev) => ({ ...prev, areaSub: value }))}
            fetchOptions={async (query: string) => {
              const subs = await areaSubService.search(query);
              return subs.map((s: any) => ({ value: s.areasId, label: s.areasDescricao }));
            }}
            required
            inputClassName="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
          />
        </div>
        <div className="md:col-span-3 flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
