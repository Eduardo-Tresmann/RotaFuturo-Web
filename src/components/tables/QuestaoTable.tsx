import React, { useState, useMemo } from 'react';
import { AdminModalView } from '../ui/AdminModalView';
import { QuestaoTableContent } from './QuestaoTableContent';
import { Questao } from '@/types/questao';

interface QuestaoTableProps {
  questoes: Questao[];
  onEdit: (questao: Questao) => void;
  onInativar: (questao: Questao) => void;
}

export function QuestaoTable({ questoes, onEdit, onInativar }: QuestaoTableProps) {
  const [showForm, setShowForm] = useState<'none' | 'questao' | 'tipo'>('none');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipoOpen, setModalTipoOpen] = useState(false);

  React.useEffect(() => {
    const handleAbrirModalQuestao = () => {
      setModalOpen(true);
      setShowForm('none');
    };
    const handleAbrirModalQuestaoTipo = () => {
      setModalTipoOpen(true);
      setShowForm('none');
    };
    window.addEventListener('abrirModalQuestao', handleAbrirModalQuestao);
    window.addEventListener('abrirModalQuestaoTipo', handleAbrirModalQuestaoTipo);
    return () => {
      window.removeEventListener('abrirModalQuestao', handleAbrirModalQuestao);
      window.removeEventListener('abrirModalQuestaoTipo', handleAbrirModalQuestaoTipo);
    };
  }, []);

  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('');

  type SortKey = 'questaoId' | 'questaoCodigo' | 'questaoDescricao' | 'questaoAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('questaoId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let data = questoes.filter((q: Questao) => {
      const matchSearch = String(q.questaoId).includes(search);
      const matchId = filterId ? String(q.questaoId) === filterId : true;
      const matchAtivo = filterAtivo ? String(q.questaoAtivo) === filterAtivo : true;
      return matchSearch && matchId && matchAtivo;
    });

    data = [...data].sort((a, b) => {
      const valA: string =
        a[sortKey] !== null && a[sortKey] !== undefined ? String(a[sortKey]).toLowerCase() : '';
      const valB: string =
        b[sortKey] !== null && b[sortKey] !== undefined ? String(b[sortKey]).toLowerCase() : '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return data;
  }, [questoes, search, sortKey, sortAsc, filterId, filterAtivo]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((asc) => !asc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
            onClick={() => setShowForm('questao')}
          >
            Inserir Questão
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-bold"
            onClick={() => setShowForm('tipo')}
          >
            Inserir Questão Tipo
          </button>
        </div>
        <div className="w-full">
          <QuestaoTableContent
            paginated={paginated}
            page={page}
            totalPages={totalPages}
            sortKey={sortKey}
            sortAsc={sortAsc}
            handleSort={handleSort}
            setPage={setPage}
            onEdit={onEdit}
            onInativar={onInativar}
          />
        </div>
        {/* Modal para QuestaoForm */}
        {showForm === 'questao' && (
          <AdminModalView open={true} onClose={() => setShowForm('none')} title="Cadastrar Questão">
            <div className="w-[400px] mx-auto p-4">
              <React.Suspense fallback={<div>Carregando...</div>}>
                {React.createElement(require('../forms/QuestaoForm').default)}
              </React.Suspense>
            </div>
          </AdminModalView>
        )}
        {/* Modal para QuestaoTipoForm */}
        {showForm === 'tipo' && (
          <AdminModalView
            open={true}
            onClose={() => setShowForm('none')}
            title="Cadastrar Tipo de Questão"
          >
            <div className="w-[400px] mx-auto p-4">
              <React.Suspense fallback={<div>Carregando...</div>}>
                {React.createElement(require('../forms/QuestaoTipoForm').default)}
              </React.Suspense>
            </div>
          </AdminModalView>
        )}
      </div>
    </div>
  );
}
