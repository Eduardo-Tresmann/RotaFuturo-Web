import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Pencil, Trash2, CheckCircle, Ban } from 'lucide-react';
import { Pagination } from '../../../../components/ui/pagination';
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
import { Area } from '@/types/area';
import { areaService } from '@/services/area/AreaService';

interface AreaTableProps {
  areas: Area[];
  onEdit: (area: Area) => void;
  onInativar: (area: Area) => void;
  onAreaCreated?: () => void;
  columnWidths?: {
    id?: string;
    descricao?: string;
    situacao?: string;
    acoes?: string;
    [key: string]: string | undefined;
  };
}

export function AreaTable({ areas, onEdit, onInativar, onAreaCreated, columnWidths }: AreaTableProps) {
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([]);
  type SortKey = 'areaId' | 'areaDescricao' | 'areaAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('areaId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  // Modal e edição agora são controlados externamente

  const filtered = useMemo(() => {
    let data = areas.filter((a: Area) => {
      const desc = a.areaDescricao || '';
      const matchSearch =
        desc.toLowerCase().includes(search.toLowerCase()) ||
        String(a.areaId).includes(search);
      return matchSearch;
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
  }, [areas, search, sortKey, sortAsc]);

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
      <Table className="text-base min-w-full max-w-6xl mx-auto align-middle rounded-sm overflow-hidden [&_th]:py-4 [&_td]:py-3 [&_th]:text-base [&_td]:text-base"> 
        <TableHeader>
          <TableRow className="bg-zinc-300/70">
            <TableHead className={columnWidths?.id ? columnWidths.id : "w-16 text-zinc-900 font-bold uppercase tracking-tight"}
                style={{ width: columnWidths?.id || '6rem', minWidth: columnWidths?.id || '6rem', maxWidth: columnWidths?.id || '6rem', color: '#18181b' }}
              onClick={() => handleSort('areaId')}
            >
              # {sortKey === 'areaId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className={columnWidths?.descricao ? columnWidths.descricao : "w-2/5 text-zinc-900  tracking-tight"}
                style={{ width: columnWidths?.descricao || '50%', minWidth: columnWidths?.descricao || '18rem', color: '#18181b' }}
              onClick={() => handleSort('areaDescricao')}
            >
              Descrição {sortKey === 'areaDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
                style={{ width: columnWidths?.situacao || '10rem', minWidth: columnWidths?.situacao || '8rem', color: '#18181b' }}
              onClick={() => handleSort('areaAtivo')}
            >
              Situação {sortKey === 'areaAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
      <TableHead className={columnWidths?.acoes ? columnWidths.acoes : "w-28 text-zinc-900  uppercase tracking-tight"}
        style={{ width: columnWidths?.acoes || '9rem', minWidth: columnWidths?.acoes || '7rem', color: '#18181b' }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-400">
                Nenhuma área encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((area) => (
              <TableRow
                key={area.areaId}
                className={'hover:bg-zinc-50'}
              >
                <TableCell className={columnWidths?.id ? columnWidths.id : "w-16 border-r border-zinc-300/20"}
                    style={{ width: columnWidths?.id || '6rem', minWidth: columnWidths?.id || '6rem', maxWidth: columnWidths?.id || '6rem' }}>
                  {area.areaId}
                </TableCell>
                <TableCell className={columnWidths?.descricao ? columnWidths.descricao : "w-2/5 border-r border-zinc-300/20"}
                    style={{ width: columnWidths?.descricao || '50%', minWidth: columnWidths?.descricao || '18rem' }}>
                  {area.areaDescricao}
                </TableCell>
        <TableCell className="border-r border-zinc-300/20"
          style={columnWidths?.situacao ? { width: columnWidths.situacao } : {}}>
                  {area.areaAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className={columnWidths?.acoes ? columnWidths.acoes : "w-28 flex gap-2"}
                    style={{ width: columnWidths?.acoes || '1rem', minWidth: columnWidths?.acoes || '1rem' }}>
                  <button
                    className="text-zinc-600 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(area)}
                  >
                    <Pencil size={18} />
                  </button>
                  {area.areaAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={async () => {
                        await areaService.inativar(area.areaId);
                        onAreaCreated && onAreaCreated();
                      }}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={async () => {
                        await areaService.ativar(area.areaId);
                        onAreaCreated && onAreaCreated();
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
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
