import React, { useState, useMemo } from 'react';
import { Questao } from '@/types/questao';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
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
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-300/70">
              <TableHead onClick={() => handleSort('questaoId')}>
                # {sortKey === 'questaoId' && (sortAsc ? '\u25b2' : '\u25bc')}
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Subárea</TableHead>
              <TableHead>Experiência</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead onClick={() => handleSort('questaoAtivo')}>
                Ativo {sortKey === 'questaoAtivo' && (sortAsc ? '\u25b2' : '\u25bc')}
              </TableHead>
              <TableHead>Ações</TableHead>
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
              <TableRow key={questao.questaoId}>
                <TableCell>{questao.questaoId}</TableCell>
                <TableCell>{questao.questaoCodigo}</TableCell>
                <TableCell>{questao.questaoDescricao}</TableCell>
                <TableCell>{questao.questaoTipoDescricao ?? '-'}</TableCell>
                <TableCell>{questao.area?.areaDescricao ?? '-'}</TableCell>
                <TableCell>{questao.areaSub?.areasDescricao ?? '-'}</TableCell>
                <TableCell>{questao.questaoExperiencia ?? '-'}</TableCell>
                <TableCell>{questao.questaoNivelDescricao ?? questao.questaoNivel ?? '-'}</TableCell>
                <TableCell>
                  <span className={questao.questaoAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {questao.questaoAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="w-28 flex gap-2" style={{ width: '9rem', minWidth: '7rem' }}>
                  <button
                    className="text-zinc-600 dark:text-zinc-200 hover:text-blue-500 p-1"
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
        {totalPages > 1 && (
          <tfoot className="bg-transparent">
            <tr>
              <td colSpan={11} className="text-center">
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
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
}
