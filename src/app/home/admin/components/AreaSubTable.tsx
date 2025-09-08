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
          <TableRow className="bg-zinc-300/70">
            <TableHead className="w-16 text-zinc-900 font-bold uppercase tracking-tight"
                style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem', color: '#18181b' }}
              onClick={() => handleSort('areasId')}
            >
              # {sortKey === 'areasId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-2/5 text-zinc-900 tracking-tight"
                style={{ width: '30%', minWidth: '12rem', color: '#18181b' }}
              onClick={() => handleSort('areasDescricao')}
            >
              Descrição {sortKey === 'areasDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-2/5 text-zinc-900 tracking-tight"
                style={{ width: '20%', minWidth: '10rem', color: '#18181b' }}
              onClick={() => handleSort('areaDescricao')}
            >
              Área Vinculada {sortKey === 'areaDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
                style={{ width: '10rem', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('areasAtivo')}
            >
              Situação {sortKey === 'areasAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-28 text-zinc-900  tracking-tight"
              style={{ width: '9rem', minWidth: '7rem', color: '#18181b' }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-400">
                Nenhuma subárea encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((areaSub) => (
              <TableRow
                key={areaSub.areasId}
                className={'hover:bg-zinc-50'}
              >
                <TableCell className="w-16 border-r border-zinc-300/20"
                    style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}>
                  {areaSub.areasId}
                </TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20"
                    style={{ width: '30%', minWidth: '12rem' }}>
                  {areaSub.areasDescricao}
                </TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20"
                    style={{ width: '20%', minWidth: '10rem' }}>
                  {areaMap[areaSub.areaId] || <span className="text-zinc-400 italic">(sem área)</span>}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '10rem', minWidth: '8rem' }}>
                  {areaSub.areasAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="w-28 flex gap-2"
                    style={{ width: '9rem', minWidth: '7rem' }}>
                  <button
                    className="text-zinc-600 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(areaSub)}
                  >
                    <Pencil size={18} />
                  </button>
                  {areaSub.areasAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
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
                      className="text-green-600 hover:text-green-800 p-1"
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
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
