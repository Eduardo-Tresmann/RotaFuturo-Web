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
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-300/70 dark:bg-neutral-800">
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight"
              onClick={() => handleSort('curId')}
            >
              # {sortKey === 'curId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('curDescricao')}
            >
              Descrição {sortKey === 'curDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('areaDescricao')}
            >
              Área {sortKey === 'areaDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('areaSubDescricao')}
            >
              Subárea {sortKey === 'areaSubDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('curAtivo')}
            >
              Situação {sortKey === 'curAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-400 dark:text-zinc-500">
                Nenhum curso encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((curso) => (
              <TableRow key={curso.curId} className="dark:hover:bg-neutral-900">
                <TableCell className="dark:text-zinc-100">{curso.curId}</TableCell>
                <TableCell className="dark:text-zinc-100">{curso.curDescricao}</TableCell>
                <TableCell className="dark:text-zinc-100">{curso.areaDescricao || <span className="text-zinc-400 dark:text-zinc-500">-</span>}</TableCell>
                <TableCell className="dark:text-zinc-100">{curso.areaSubDescricao || <span className="text-zinc-400 dark:text-zinc-500">-</span>}</TableCell>
                <TableCell className="dark:text-zinc-100">
                  {curso.curAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="dark:text-zinc-100">
                  <button
                    className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                    title="Editar"
                    onClick={() => onEdit(curso)}
                  >
                    <Pencil size={18} strokeWidth={2.2} />
                  </button>
                  {curso.curAtivo ? (
                    <button
                      className="text-red-700 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 p-1"
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
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1"
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
            <TableCell colSpan={6} className="text-center">
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
