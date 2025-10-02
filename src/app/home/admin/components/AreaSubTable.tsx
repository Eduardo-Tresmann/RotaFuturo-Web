import React, { useState, useMemo } from 'react';
import { Pencil, CheckCircle, Ban } from 'lucide-react';
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
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { useEffect, useState as useReactState } from 'react';
import { Badge } from '@/components/ui/Badge';
interface AreaSubTableProps {
  areaSubs: AreaSub[];
  onEdit: (areaSub: AreaSub) => void;
  onInativar: (areaSub: AreaSub) => void;
}
export function AreaSubTable({ areaSubs, onEdit, onInativar }: AreaSubTableProps) {
  const [search, setSearch] = useState('');
  type SortKey = 'areasId' | 'areasDescricao' | 'areasAtivo' | 'areaDescricao';
  const [sortKey, setSortKey] = useState<SortKey>('areasId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [areaMap, setAreaMap] = useReactState<Record<number, string>>({});
  useEffect(() => {
    async function fetchAreas() {
      const areas = await areaService.listAll();
      const map: Record<number, string> = {};
      areas.forEach(a => { map[a.areaId] = a.areaDescricao; });
      setAreaMap(map);
    }
    fetchAreas();
  }, []);
  const filtered = useMemo(() => {
    let data = areaSubs.filter((a: AreaSub) => {
      const desc = a.areasDescricao || '';
      const matchSearch =
        desc.toLowerCase().includes(search.toLowerCase()) ||
        String(a.areasId).includes(search);
      return matchSearch;
    });
    data = [...data].sort((a, b) => {
      let valA: string | number | boolean;
      let valB: string | number | boolean;
      if (sortKey === 'areaDescricao') {
        valA = areaMap[a.areaId] || '';
        valB = areaMap[b.areaId] || '';
      } else {
        valA = a[sortKey];
        valB = b[sortKey];
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [areaSubs, search, sortKey, sortAsc, areaMap]);
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
          <TableRow className="bg-zinc-300/70 dark:bg-neutral-800">
            <TableHead
              className="w-16 text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight"
              style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}
              onClick={() => handleSort('areasId')}
            >
              # {sortKey === 'areasId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="w-2/5 text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ width: '30%', minWidth: '12rem' }}
              onClick={() => handleSort('areasDescricao')}
            >
              Descrição {sortKey === 'areasDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="w-2/5 text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ width: '20%', minWidth: '10rem' }}
              onClick={() => handleSort('areaDescricao')}
            >
              Área Vinculada {sortKey === 'areaDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ width: '10rem', minWidth: '8rem' }}
              onClick={() => handleSort('areasAtivo')}
            >
              Situação {sortKey === 'areasAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="w-28 text-zinc-900 dark:text-zinc-100 tracking-tight"
              style={{ width: '9rem', minWidth: '7rem' }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-400 dark:text-zinc-500">
                Nenhuma subárea encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((areaSub) => (
              <TableRow
                key={areaSub.areasId}
                className="hover:bg-zinc-50 dark:hover:bg-neutral-900"
              >
                <TableCell className="dark:text-zinc-100">{areaSub.areasId}</TableCell>
                <TableCell className="dark:text-zinc-100">{areaSub.areasDescricao}</TableCell>
                <TableCell className="dark:text-zinc-100">
                  {areaMap[areaSub.areaId] || <span className="text-zinc-400 italic dark:text-zinc-500">(sem área)</span>}
                </TableCell>
                <TableCell>
                  {areaSub.areasAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                    title="Editar"
                    onClick={() => onEdit(areaSub)}
                  >
                    <Pencil size={18} />
                  </button>
                  {areaSub.areasAtivo ? (
                    <button
                      className="text-red-700 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 p-1"
                      title="Inativar"
                      onClick={async () => {
                        await areaSubService.inativar(areaSub.areasId);
                        onInativar(areaSub);
                      }}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1"
                      title="Ativar"
                      onClick={async () => {
                        await areaSubService.update(areaSub.areasId, { areasAtivo: true });
                        onInativar(areaSub);
                      }}
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
            <TableCell colSpan={5} className="text-center">
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="dark:text-zinc-100">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 disabled:opacity-50"
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
