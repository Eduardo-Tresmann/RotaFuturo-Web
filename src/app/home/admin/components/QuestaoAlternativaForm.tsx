import React, { useState } from 'react';
import { TextField } from '../../../../components/ui/form-components/text-field';
import { AutoCompleteField } from '../../../../components/ui/form-components/autocomplete-field';
import { questaoService } from '@/services/questao/QuestaoService';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';
import { questaoAlternativaService } from '@/services/questao/QuestaoAlternativaService';

export interface QuestaoAlternativa {
  quesaId?: number;
  quesaDescricao: string;
  quesaCorreta: boolean;
  questaoId?: number;
  questao?: { questaoId: number };
}

export default function QuestaoAlternativaForm({ onSuccess, data }: { onSuccess?: () => void, data?: Partial<QuestaoAlternativa> }) {
  // Inicializa o form corretamente a partir de data
  const initialForm: Partial<QuestaoAlternativa> = data
    ? {
        ...data,
        questaoId:
          typeof data.questaoId === 'number'
            ? data.questaoId
            : (data.questao && typeof data.questao === 'object' ? data.questao.questaoId : undefined),
      }
    : { quesaDescricao: '', quesaCorreta: false, questaoId: 0 };
  const [form, setForm] = useState<Partial<QuestaoAlternativa>>(initialForm);
  const { error, success } = FormNotification;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.questaoId) {
      error({ message: 'Selecione uma questão válida.' });
      return;
    }
    try {
      // Monta o payload esperado pelo backend
      const payload = {
        quesaDescricao: form.quesaDescricao,
        quesaCorreta: form.quesaCorreta ? 1 : 0,
        questao: { questaoId: form.questaoId },
        quesaId: form.quesaId,
      };
      if (form.quesaId) {
        await questaoAlternativaService.update(form.quesaId, payload);
        success({ message: 'Alternativa atualizada!' });
      } else {
        await questaoAlternativaService.create(payload);
        success({ message: 'Alternativa salva!' });
      }
      setForm({ quesaDescricao: '', quesaCorreta: false, questaoId: 0 });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar Alternativa' });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextField
        name="quesaDescricao"
        type="text"
        label={<span>Descrição da Alternativa</span>}
        value={form.quesaDescricao || ''}
        onChange={handleChange}
        required
      />
      <AutoCompleteField
        name="questaoId"
        label={<span>Questão</span>}
        value={form.questaoId || ''}
        onChange={(value) => setForm((prev) => ({ ...prev, questaoId: Number(value) }))}
        fetchOptions={async (query) => {
          const questoes = await questaoService.listAll();
          return questoes
            .filter(q =>
              q.questaoDescricao.toLowerCase().includes(query.toLowerCase()) ||
              String(q.questaoId).includes(query)
            )
            .map(q => ({ value: q.questaoId, label: `${q.questaoId} - ${q.questaoDescricao}` }));
        }}
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="quesaCorreta"
          checked={form.quesaCorreta || false}
          onChange={handleChange}
        />
        Correta
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
      >
        Salvar Alternativa
      </button>
    </form>
  );
}