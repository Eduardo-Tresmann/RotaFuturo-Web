import React, { useState } from 'react';
import { AutoCompleteField } from '@/components/ui/form-components/autocomplete-field';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { Teste } from '@/services/teste/TesteService';
interface TesteFormProps {
  initial?: Partial<Teste>;
  onSave: (data: Partial<Teste>) => void;
  onCancel: () => void;
}
export default function TesteForm({ initial = {}, onSave, onCancel }: TesteFormProps) {
  const [descricao, setDescricao] = useState(initial.tesDescricao || '');
  const [area, setArea] = useState(initial.areaId || '');
  const [areaSub, setAreaSub] = useState(initial.areaSubId || '');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      tesDescricao: descricao,
      areaId: area ? Number(area) : undefined,
      areaSubId: areaSub ? Number(areaSub) : undefined,
    });
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <label className="font-medium">Descrição do Teste</label>
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
      <AutoCompleteField
        name="area"
        label={<span className="font-medium">Área</span>}
        value={area}
        onChange={setArea}
        fetchOptions={async (query) => {
          const areas = await areaService.search(query);
          return areas.map((a) => ({ value: a.areaId, label: a.areaDescricao }));
        }}
        inputClassName="border rounded px-2 py-1"
      />
      <AutoCompleteField
        name="areaSub"
        label={<span className="font-medium">Área Sub</span>}
        value={areaSub}
        onChange={setAreaSub}
        fetchOptions={async (query) => {
          const subs = await areaSubService.search(query);
          return subs.map((s) => ({ value: s.areasId, label: s.areasDescricao }));
        }}
        inputClassName="border rounded px-2 py-1"
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
