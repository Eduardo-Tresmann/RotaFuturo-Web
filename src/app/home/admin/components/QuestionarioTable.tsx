import React, { useState, useMemo } from 'react';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
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
        <TableHeader>
          <TableRow className="bg-zinc-300/70 dark:bg-neutral-800">
            <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight">
              #
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Título
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Área
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Situação
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ borderRight: '1px solid transparent' }}
            >
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-400"
                style={{ borderBottom: '1px solid transparent' }}
              >
                Nenhum questionário encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((questionario) => (
              <TableRow key={questionario.quesId} className="dark:hover:bg-neutral-900">
                <TableCell className="dark:text-zinc-100">{questionario.quesId}</TableCell>
                <TableCell className="dark:text-zinc-100">{questionario.quesDescricao}</TableCell>
                <TableCell className="dark:text-zinc-100">{questionario.area?.areaDescricao || '-'}</TableCell>
                <TableCell className="dark:text-zinc-100">
                  {questionario.quesAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell
                  className="w-28 flex gap-2 dark:text-zinc-100"
                  style={{ width: '9rem', minWidth: '7rem', borderRight: '1px solid transparent' }}
                >
                  <button
                    className="text-zinc-600 dark:text-zinc-200 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(questionario)}
                  >
                    <Pencil size={18} strokeWidth={2.2} />
                  </button>
                  {questionario.quesAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={() => onInativar(questionario)}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={() => onInativar(questionario)}
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {/* paginação ou info */}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
