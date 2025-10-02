import React, { useState, useEffect } from 'react';
import { AutoCompleteField } from '@/components/ui/form-components/autocomplete-field';
import { TesteQuestao, testeService, Teste } from '@/services/teste/TesteService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { Area } from '@/types/area';
import { AreaSub } from '@/types/areasub';
interface TesteQuestaoFormProps {
  initial?: Partial<TesteQuestao>;
  onSave: (data: Partial<TesteQuestao>) => void;
  onCancel: () => void;
}
export default function TesteQuestaoForm({
  initial = {},
  onSave,
  onCancel,
}: TesteQuestaoFormProps) {
  const [descricao, setDescricao] = useState(initial.tesqDescricao || '');
  const [testeId, setTesteId] = useState(initial.testeId || '');
  const [areaId, setAreaId] = useState(initial.areaId || '');
  const [areaSubId, setAreaSubId] = useState(initial.areaSubId || '');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      tesqId: initial.tesqId,
      tesqDescricao: descricao,
      testeId: testeId ? Number(testeId) : undefined,
      areaId: areaId ? Number(areaId) : undefined,
      areaSubId: areaSubId ? Number(areaSubId) : undefined,
    });
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <AutoCompleteField
        name="teste"
        label={<span className="font-medium">Teste</span>}
        value={testeId}
        onChange={setTesteId}
        fetchOptions={async (query) => {
          const testes = await testeService.listTestes();
          return testes
            .filter((t) => t.tesDescricao.toLowerCase().includes(query.toLowerCase()))
            .map((t) => ({ value: t.tesId, label: t.tesDescricao }));
        }}
        inputClassName="border rounded px-2 py-1"
      />
      <AutoCompleteField
        name="area"
        label={<span className="font-medium">Área</span>}
        value={areaId}
        onChange={setAreaId}
        fetchOptions={async (query) => {
          const areas = await areaService.search(query);
          return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
        }}
        inputClassName="border rounded px-2 py-1"
      />
      <AutoCompleteField
        name="areaSub"
        label={<span className="font-medium">Área Sub</span>}
        value={areaSubId}
        onChange={setAreaSubId}
        fetchOptions={async (query) => {
          const subs = await areaSubService.search(query);
          return subs.map((s) => ({ value: s.areasId, label: s.areasDescricao }));
        }}
        inputClassName="border rounded px-2 py-1"
      />
      <label className="font-medium">Descrição da Questão</label>
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Salvar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
