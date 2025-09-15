import React, { useState, useMemo } from 'react';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
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
import { Materia } from '@/types/materia';

interface MateriaTableProps {
  materias: Materia[];
  onEdit: (materia: Materia) => void;
  onRefresh?: () => void;
}

import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/pagination';
import { materiaService } from '@/services/materia/MateriaService';
import { FormNotification } from '@/components/ui/form-components/form-notification';

export function MateriaTable({ materias, onEdit, onRefresh }: MateriaTableProps) {
  // Ordenação
  type SortKey = 'matId' | 'matDescricao' | 'matAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('matId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const sorted = useMemo(() => {
    let data = [...materias];
    data = data.sort((a, b) => {
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
  }, [materias, sortKey, sortAsc]);

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
              onClick={() => handleSort('matId')}
            >
              # {sortKey === 'matId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('matDescricao')}
            >
              Descrição {sortKey === 'matDescricao' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Área
            </TableHead>
            <TableHead className="text-zinc-900 dark:text-zinc-100 tracking-tight">
              Área Sub
            </TableHead>
            <TableHead
              className="text-zinc-900 dark:text-zinc-100 tracking-tight"
              onClick={() => handleSort('matAtivo')}
            >
              Situação {sortKey === 'matAtivo' && (sortAsc ? '▲' : '▼')}
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
                Nenhuma matéria encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((materia) => (
              <TableRow key={materia.matId} className="dark:hover:bg-neutral-900">
                <TableCell className="dark:text-zinc-100">{materia.matId}</TableCell>
                <TableCell className="dark:text-zinc-100">{materia.matDescricao}</TableCell>
                <TableCell className="dark:text-zinc-100">{materia.areaDescricao || '-'}</TableCell>
                <TableCell className="dark:text-zinc-100">{materia.areaSubDescricao || '-'}</TableCell>
                <TableCell className="dark:text-zinc-100">
                  {materia.matAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="dark:text-zinc-100">
                  <button
                    className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                    title="Editar"
                    onClick={() => onEdit(materia)}
                  >
                    <Pencil size={18} strokeWidth={2.2} />
                  </button>
                  {materia.matAtivo ? (
                    <button
                      className="text-red-700 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 p-1"
                      title="Inativar"
                      onClick={async () => {
                        await materiaService.inativar(materia.matId);
                        FormNotification.success({ message: 'Matéria inativada com sucesso!' });
                        if (onRefresh) await onRefresh();
                      }}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1"
                      title="Ativar"
                      onClick={async () => {
                        await materiaService.update(materia.matId, { ...materia, matAtivo: true });
                        FormNotification.success({ message: 'Matéria ativada com sucesso!' });
                        if (onRefresh) await onRefresh();
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
                    disabled={page === totalPages}
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
         