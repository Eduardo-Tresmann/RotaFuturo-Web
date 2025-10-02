import React, { useState, useMemo } from 'react';
import { Pencil, Ban, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/Badge';
interface NivelQuestao {
  quesnId: number;
  quesnDescricao: string;
  quesnAtivo?: boolean;
}
export interface QuestaoNivelTableProps {
  niveis: NivelQuestao[];
  onEdit: (nivel: NivelQuestao) => void;
  onInativar: (nivel: NivelQuestao) => void;
}
export function QuestaoNivelTable({ niveis, onEdit, onInativar }: QuestaoNivelTableProps) {
  const [search, setSearch] = useState('');
  type SortKey = 'quesnId' | 'quesnDescricao' | 'quesnAtivo';
  const [sortKey, setSortKey] = useState<SortKey>('quesnId');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filtered = useMemo(() => {
    let data = niveis.filter((n) => {
      const desc = n.quesnDescricao || '';
      const matchSearch =
        desc.toLowerCase().includes(search.toLowerCase()) ||
        String(n.quesnId).includes(search);
      return matchSearch;
    });
    data = [...data].sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [niveis, search, sortKey, sortAsc]);
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
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('quesnId')}>
              # {sortKey === 'quesnId' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead onClick={() => handleSort('quesnDescricao')}>
              Descrição {sortKey === 'quesnDescricao' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead onClick={() => handleSort('quesnAtivo')}>
              Situação {sortKey === 'quesnAtivo' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-400">
                Nenhum nível encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((n) => (
              <TableRow key={n.quesnId}>
                <TableCell>{n.quesnId}</TableCell>
                <TableCell>{n.quesnDescricao}</TableCell>
                <TableCell>
                  {n.quesnAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <button className="mr-2" onClick={() => onEdit(n)} title="Editar"><Pencil size={18} /></button>
                  {n.quesnAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={() => onInativar(n)}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={() => onInativar(n)}
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
                <div className="flex justify-end items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
                  <span>Página {page} de {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
