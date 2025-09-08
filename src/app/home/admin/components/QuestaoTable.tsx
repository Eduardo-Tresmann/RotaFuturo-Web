import React, { useState, useMemo } from 'react';


import { Questao } from '@/types/questao';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from '@/components/ui/table';

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
    <div className="w-full max-w-screen-2xl mx-auto ">
      <Table className="text-base min-w-full max-w-6xl mx-auto align-middle rounded overflow-hidden [&_th]:py-4 [&_td]:py-3 [&_th]:text-base [&_td]:text-base">
        <TableHeader>
          <TableRow className="bg-zinc-300/70">
            <TableHead className="w-16 text-zinc-900 font-bold uppercase tracking-tight"
              style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem', color: '#18181b' }}
              onClick={() => handleSort('questaoId')}
            >
              # {sortKey === 'questaoId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Código</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Descrição</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Tipo</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Área</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Subárea</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Experiência</TableHead>
            <TableHead className="text-zinc-900 tracking-tight">Nível</TableHead>
            <TableHead className="cursor-pointer text-zinc-900 tracking-tight" onClick={() => handleSort('questaoAtivo')}>
              Ativo {sortKey === 'questaoAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-28 text-zinc-900 uppercase tracking-tight" style={{ width: '9rem', minWidth: '7rem', color: '#18181b' }}>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-400">
                Nenhuma questão encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((questao) => (
              <TableRow key={questao.questaoId} className={'hover:bg-zinc-50'}>
                <TableCell className="w-16 border-r border-zinc-300/20" style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}>{questao.questaoId}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.questaoCodigo}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.questaoDescricao}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.questaoTipoDescricao ?? '-'}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.area?.areaDescricao ?? '-'}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.areaSub?.areasDescricao ?? '-'}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{questao.questaoExperiencia ?? '-'}</TableCell>
                <TableCell className="border-r border-zinc-300/20">{
                  questao.questaoNivelDescricao ?? questao.questaoNivel ?? '-'
                }</TableCell>
                <TableCell className="border-r border-zinc-300/20">
                  <span className={questao.questaoAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {questao.questaoAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="w-28 flex gap-2" style={{ width: '9rem', minWidth: '7rem' }}>
                  <button
                    className="text-zinc-600 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(questao)}
                  >
                    <Pencil size={18} strokeWidth={2.2} />
                  </button>
                  {questao.questaoAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={() => onInativar(questao)}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={() => onInativar(questao)}
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className='bg-transparent'>
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
