import React, { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { AreaSub } from '@/types/areasub';

interface AreaSubTableProps {
  areaSubs: AreaSub[];
  onEdit: (areaSub: AreaSub) => void;
  onInativar: (areaSub: AreaSub) => void;
}

export function AreaSubTable({ areaSubs, onEdit, onInativar }: AreaSubTableProps) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // ...existing code...
  const [filterId, setFilterId] = useState('');
  const [filterDescricao, setFilterDescricao] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('');
  type SortKey = 'areasId' | 'areasDescricao' | 'areasAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('areasId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let data = areaSubs.filter((a: AreaSub) => {
      const matchSearch =
        a.areasDescricao.toLowerCase().includes(search.toLowerCase()) ||
        String(a.areasId).includes(search);
      const matchId = filterId ? String(a.areasId) === filterId : true;
      const matchDescricao = filterDescricao
        ? a.areasDescricao.toLowerCase().includes(filterDescricao.toLowerCase())
        : true;
      const matchAtivo = filterAtivo ? String(a.areasAtivo) === filterAtivo : true;
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
  }, [areaSubs, search, sortKey, sortAsc, filterId, filterDescricao, filterAtivo]);

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
        <TableCaption>Lista de subáreas do sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('areasId')}>
              ID {sortKey === 'areasId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('areasDescricao')}>
              Descrição {sortKey === 'areasDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('areasAtivo')}>
              Ativo {sortKey === 'areasAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400">
                Nenhuma subárea encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((areaSub) => (
              <TableRow key={areaSub.areasId}>
                <TableCell>{areaSub.areasId}</TableCell>
                <TableCell>{areaSub.areasDescricao}</TableCell>
                <TableCell>
                  <span
                    className={
                      areaSub.areasAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                    }
                  >
                    {areaSub.areasAtivo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <button
                      className="text-blue-600 hover:bg-blue-100 rounded-md p-1 transition flex items-center justify-center"
                      title="Editar"
                      onClick={() => onEdit(areaSub)}
                    >
                      <Pencil size={18} strokeWidth={2.2} />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 rounded-md p-1 transition flex items-center justify-center"
                      title="Inativar"
                      onClick={() => onInativar(areaSub)}
                    >
                      <Trash2 size={18} strokeWidth={2.2} />
                    </button>
                  </div>
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
