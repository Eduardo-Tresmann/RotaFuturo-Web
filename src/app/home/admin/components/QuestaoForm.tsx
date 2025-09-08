'use client';
import React, { useState } from 'react';
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

export default function QuestaoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<Partial<Questao>>({
    questaoCodigo: '',
    questaoDescricao: '',
    questaoExperiencia: undefined,
    questaoNivel: undefined,
    questaoTipo: undefined,
    area: undefined,
    areaSub: undefined,
  });
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
      };
      await questaoService.create(payload);
      success({ message: 'Questão salva!' });
      setForm({
        questaoCodigo: '',
        questaoDescricao: '',
        questaoExperiencia: undefined,
        questaoNivel: undefined,
        questaoTipo: undefined,
        area: undefined,
        areaSub: undefined,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar questão' });
    }
  }

  return (
  <div className="bg-white rounded-2xl shadow-soft p-8 mx-auto">
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
          <TextArea
            name="questaoDescricao"
            label="Enunciado da Questão"
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
            min={0}
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="questaoTipo"
            label="Tipo de Questão"
            value={form.questaoTipo}
            onChange={(value) => setForm((prev) => ({ ...prev, questaoTipo: value }))}
            fetchOptions={async (query) => {
              const tipos = await questaoTipoService.listAll();
              return tipos
                .filter((t) => t.quetDescricao.toLowerCase().includes(query.toLowerCase()))
                .map((t) => ({ value: t.quetId!, label: t.quetDescricao }));
            }}
            required
          />
        </div>
        <div className="md:col-span-1">
          <AutoCompleteField
            name="questaoNivel"
            label="Nível da Questão"
            value={form.questaoNivel}
            onChange={(value) => setForm((prev) => ({ ...prev, questaoNivel: value }))}
            fetchOptions={async (query) => {
              const niveis = await questaoNivelService.listAll();
              return niveis
                .filter((n) => n.quesnDescricao.toLowerCase().includes(query.toLowerCase()))
                .map((n) => ({ value: n.quesnId!, label: n.quesnDescricao }));
            }}
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
