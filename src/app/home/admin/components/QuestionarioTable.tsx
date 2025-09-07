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
      <div className="flex items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtro'}
        </button>
      </div>
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded shadow flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">ID</label>
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
              ID {sortKey === 'quesId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('quesDescricao')}>
              Descrição {sortKey === 'quesDescricao' && (sortAsc ? '▲' : '▼')}
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
                <TableCell>
                  <span
                    className={
                      questionario.quesAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                    }
                  >
                    {questionario.quesAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    className="text-blue-600 hover:bg-blue-100 rounded p-1 mr-2"
                    title="Editar"
                    onClick={() => onEdit(questionario)}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600 hover:bg-red-100 rounded p-1"
                    title="Inativar"
                    onClick={() => onInativar(questionario)}
                  >
                    🗑️
                  </button>
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
