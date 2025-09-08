interface Alternativa {
  quesaId: number;
  quesaDescricao: string;
  quesaCorreta: number;
  questao: { questaoId: number; questaoCodigo?: string };
}

interface AlternativaTableProps {
  alternativas: Alternativa[];
  onEdit: (alternativa: Alternativa) => void;
  onInativar: (alternativa: Alternativa) => void;
}

import React, { useState, useMemo } from 'react';
import { Pencil, Ban } from 'lucide-react';
import { Pagination } from '../../../../components/ui/pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export function AlternativaTable({ alternativas, onEdit, onInativar }: AlternativaTableProps) {
  const [search, setSearch] = useState('');
  type SortKey = 'quesaId' | 'quesaDescricao' | 'quesaCorreta' | 'questaoCodigo';
  const [sortKey, setSortKey] = useState<SortKey>('quesaId');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let data = alternativas.filter((a) => {
      const desc = a.quesaDescricao || '';
      const questaoCod = a.questao?.questaoCodigo || '';
      const matchSearch =
        desc.toLowerCase().includes(search.toLowerCase()) ||
        String(a.quesaId).includes(search) ||
        questaoCod.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
    data = [...data].sort((a, b) => {
      let valA: any;
      let valB: any;
      if (sortKey === 'questaoCodigo') {
        valA = a.questao?.questaoCodigo || '';
        valB = b.questao?.questaoCodigo || '';
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
  }, [alternativas, search, sortKey, sortAsc]);

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
              onClick={() => handleSort('quesaId')}
            >
              # {sortKey === 'quesaId' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              className="w-2/5 text-zinc-900 tracking-tight"
              style={{ width: '50%', minWidth: '18rem', color: '#18181b' }}
              onClick={() => handleSort('quesaDescricao')}
            >
              Descrição {sortKey === 'quesaDescricao' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              className="text-zinc-900 tracking-tight"
              style={{ width: '10rem', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('quesaCorreta')}
            >
              Correta? {sortKey === 'quesaCorreta' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              className="text-zinc-900 tracking-tight"
              style={{ width: '10rem', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('questaoCodigo')}
            >
              Questão Código {sortKey === 'questaoCodigo' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead className="w-28 text-zinc-900 uppercase tracking-tight" style={{ width: '9rem', minWidth: '7rem', color: '#18181b' }}>
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-zinc-400">
                Nenhuma alternativa encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((a, idx) => (
              <TableRow key={a.quesaId ?? `alt-${idx}`} className={'hover:bg-zinc-50'}>
                <TableCell className="w-16 border-r border-zinc-300/20">{a.quesaId}</TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20">{a.quesaDescricao}</TableCell>
                <TableCell className="border-r border-zinc-300/20">
                  {a.quesaCorreta === 1 ? (
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">SIM</span>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">NÃO</span>
                  )}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20">{a.questao?.questaoCodigo || a.questao?.questaoId}</TableCell>
                <TableCell className="w-28 flex gap-2">
                  <button className="text-blue-600 mr-2" onClick={() => onEdit(a)} title="Editar"><Pencil size={16} /></button>
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
