import React, { useState, useMemo } from 'react';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
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
import { Curso } from '@/types/curso';

interface CursoTableProps {
  cursos: Curso[];
  onEdit: (curso: Curso) => void;
  onInativar: (curso: Curso) => void;
}

import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/pagination';

import { cursoService } from '@/services/curso/CursoService';
import { useCallback } from 'react';
import { FormNotification } from '@/components/ui/form-components/form-notification';

export function CursoTable({ cursos, onEdit, onInativar, onRefresh }: CursoTableProps & { onRefresh?: () => void }) {
  const { success, error } = FormNotification;
  // Ordenação
  type SortKey = 'curId' | 'curDescricao' | 'curAtivo' | 'areaDescricao' | 'areaSubDescricao';
  const [sortKey, setSortKey] = useState<SortKey>('curId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const sorted = useMemo(() => {
    let data = [...cursos];
    data = data.sort((a, b) => {
      let valA = (a[sortKey] === undefined || a[sortKey] === null) ? '' : a[sortKey];
      let valB = (b[sortKey] === undefined || b[sortKey] === null) ? '' : b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [cursos, sortKey, sortAsc]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

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
              onClick={() => handleSort('curId')}
            >
              # {sortKey === 'curId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-2/5 text-zinc-900 tracking-tight"
              style={{ width: '30%', minWidth: '12rem', color: '#18181b' }}
              onClick={() => handleSort('curDescricao')}
            >
              Descrição {sortKey === 'curDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '18%', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('areaDescricao')}
            >
              Área {sortKey === 'areaDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '18%', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('areaSubDescricao')}
            >
              Subárea {sortKey === 'areaSubDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '10rem', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('curAtivo')}
            >
              Situação {sortKey === 'curAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-28 text-zinc-900 uppercase tracking-tight"
              style={{ width: '9rem', minWidth: '7rem', color: '#18181b' }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-400">
                Nenhum curso encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((curso) => (
              <TableRow key={curso.curId} className={'hover:bg-zinc-50'}>
                <TableCell className="w-16 border-r border-zinc-300/20"
                  style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}>
                  {curso.curId}
                </TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20"
                  style={{ width: '30%', minWidth: '12rem' }}>
                  {curso.curDescricao}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '18%', minWidth: '8rem' }}>
                  {curso.areaDescricao || <span className="text-zinc-400">-</span>}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '18%', minWidth: '8rem' }}>
                  {curso.areaSubDescricao || <span className="text-zinc-400">-</span>}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '10rem', minWidth: '8rem' }}>
                  {curso.curAtivo ? (
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
                    onClick={() => onEdit(curso)}
                  >
                    <Pencil size={18} strokeWidth={2.2} />
                  </button>
                  {curso.curAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={async () => {
                        try {
                          await cursoService.inativar(curso.curId);
                          success({ message: 'Curso inativado!' });
                          if (onRefresh) onRefresh();
                        } catch (e) {
                          error({ message: 'Erro ao inativar curso.' });
                        }
                      }}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={async () => {
                        try {
                          await cursoService.update(curso.curId, { ...curso, curAtivo: true });
                          success({ message: 'Curso ativado!' });
                          if (onRefresh) onRefresh();
                        } catch (e) {
                          error({ message: 'Erro ao ativar curso.' });
                        }
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
            <TableCell colSpan={4} className="text-center">
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
