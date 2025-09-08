import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Questionario } from '@/types/questionario';

interface QuestionarioTableProps {
  questionarios: Questionario[];
  onEdit: (questionario: Questionario) => void;
  onInativar: (questionario: Questionario) => void;
}

export function QuestionarioTable({ questionarios, onEdit, onInativar }: QuestionarioTableProps) {
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [filterDescricao, setFilterDescricao] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('');
  type SortKey = 'quesId' | 'quesDescricao' | 'quesAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('quesId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let data = questionarios.filter((q: Questionario) => {
      const matchSearch =
        q.quesDescricao.toLowerCase().includes(search.toLowerCase()) ||
        String(q.quesId).includes(search);
      const matchId = filterId ? String(q.quesId) === filterId : true;
      const matchDescricao = filterDescricao
        ? q.quesDescricao.toLowerCase().includes(filterDescricao.toLowerCase())
        : true;
      const matchAtivo = filterAtivo ? String(q.quesAtivo) === filterAtivo : true;
      return matchSearch && matchId && matchDescricao && matchAtivo;
    });
    data = [...data].sort((a, b) => {
      let valA: string | number | boolean = a[sortKey];
      let valB: string | number | boolean = b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [questionarios, search, sortKey, sortAsc, filterId, filterDescricao, filterAtivo]);

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
    <div>
  {/* Filtro removido conforme solicitado */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded shadow flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">#</label>
            <input
              type="number"
              value={filterId}
              onChange={(e) => {
                setFilterId(e.target.value);
                setPage(1);
              }}
              className="border rounded px-2 py-1 w-24"
              placeholder="ID"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Descrição</label>
            <input
              type="text"
              value={filterDescricao}
              onChange={(e) => {
                setFilterDescricao(e.target.value);
                setPage(1);
              }}
              className="border rounded px-2 py-1 w-40"
              placeholder="Descrição"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Ativo</label>
            <select
              value={filterAtivo}
              onChange={(e) => {
                setFilterAtivo(e.target.value);
                setPage(1);
              }}
              className="border rounded px-2 py-1 w-24"
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
      )}
      <Table>
        <TableCaption>Lista de questionários do sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('quesId')}>
              # {sortKey === 'quesId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('quesDescricao')}>
              Descrição {sortKey === 'quesDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead>
              Tipo de Questionário
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('quesAtivo')}>
              Ativo {sortKey === 'quesAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400">
                Nenhum questionário encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((questionario) => (
              <TableRow key={questionario.quesId}>
                <TableCell>{questionario.quesId}</TableCell>
                <TableCell>{questionario.quesDescricao}</TableCell>
                <TableCell>{questionario.questionarioTipo?.descricao || questionario.questionarioTipo?.questDescricao || '-'}</TableCell>
                <TableCell>
                  <span
                    className={
                      questionario.quesAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                    }
                  >
                    {questionario.quesAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="w-28 flex gap-2" style={{ width: '9rem', minWidth: '7rem' }}>
                  <button
                    className="text-zinc-600 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(questionario)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  </button>
                  {questionario.quesAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={() => onInativar(questionario)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={() => onInativar(questionario)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 15 9"/></svg>
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
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
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                  className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
