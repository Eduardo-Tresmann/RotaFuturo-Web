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
      
      <Table className="text-base min-w-full max-w-6xl mx-auto align-middle rounded overflow-hidden [&_th]:py-4 [&_td]:py-3 [&_th]:text-base [&_td]:text-base">
        <TableHeader>
          <TableRow className="bg-zinc-300/70">
            <TableHead
              className="w-16 text-zinc-900 font-bold uppercase tracking-tight"
              style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem', color: '#18181b' }}
              onClick={() => handleSort('quesnId')}
            >
              # {sortKey === 'quesnId' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              className="w-2/5 text-zinc-900 tracking-tight"
              style={{ width: '50%', minWidth: '18rem', color: '#18181b' }}
              onClick={() => handleSort('quesnDescricao')}
            >
              Descrição {sortKey === 'quesnDescricao' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              className="text-zinc-900 tracking-tight"
              style={{ width: '10rem', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('quesnAtivo')}
            >
              Ativo? {sortKey === 'quesnAtivo' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead className="w-28 text-zinc-900 uppercase tracking-tight" style={{ width: '9rem', minWidth: '7rem', color: '#18181b' }}>
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
              <TableRow key={n.quesnId} className={'hover:bg-zinc-50'}>
                <TableCell className="w-16 border-r border-zinc-300/20">{n.quesnId}</TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20">{n.quesnDescricao}</TableCell>
                <TableCell className="border-r border-zinc-300/20">
                  {n.quesnAtivo ? (
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">SIM</span>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">NÃO</span>
                  )}
                </TableCell>
                <TableCell className="w-28 flex gap-2">
                  <button className="text-blue-600 mr-2" onClick={() => onEdit(n)} title="Editar"><Pencil size={16} /></button>
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
