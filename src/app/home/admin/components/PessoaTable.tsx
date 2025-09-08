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
import { Badge } from '@/components/ui/Badge';
import { Pessoa } from '@/types/pessoa';
import { Pagination } from '@/components/ui/pagination';

interface PessoaTableProps {
  pessoas: Pessoa[];
  usuarios?: { usuId: number; usuEmail: string }[];
  onEdit: (pessoa: Pessoa) => void;
  onInativar: (pessoa: Pessoa) => void;
}

export function PessoaTable({ pessoas, usuarios = [], onEdit, onInativar }: PessoaTableProps) {
  const [sortKey, setSortKey] = useState<'pesId' | 'pesNome' | 'pesApelido' | 'pesNivel'>('pesId');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const sorted = useMemo(() => {
    let data = [...pessoas];
    data.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [pessoas, sortKey, sortAsc]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.ceil(sorted.length / pageSize);

  function handleSort(key: 'pesId' | 'pesNome' | 'pesApelido' | 'pesNivel') {
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
            <TableHead className="w-16 text-zinc-900 font-bold uppercase tracking-tight"
              style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem', color: '#18181b' }}
              onClick={() => handleSort('pesId')}
            >
              # {sortKey === 'pesId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="w-2/5 text-zinc-900 tracking-tight"
              style={{ width: '50%', minWidth: '18rem', color: '#18181b' }}
              onClick={() => handleSort('pesNome')}
            >
              Nome {sortKey === 'pesNome' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '20%', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('pesApelido')}
            >
              Apelido {sortKey === 'pesApelido' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '10%', minWidth: '8rem', color: '#18181b' }}
              onClick={() => handleSort('pesNivel')}
            >
              Nível {sortKey === 'pesNivel' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-zinc-900 tracking-tight"
              style={{ width: '20%', minWidth: '12rem', color: '#18181b' }}>
              E-mail do Usuário
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
              <TableCell colSpan={5} className="text-center text-zinc-400">
                Nenhuma pessoa encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((pessoa) => (
              <TableRow
                key={pessoa.pesId}
                className={'hover:bg-zinc-50'}
              >
                <TableCell className="w-16 border-r border-zinc-300/20"
                  style={{ width: '6rem', minWidth: '6rem', maxWidth: '6rem' }}>
                  {pessoa.pesId}
                </TableCell>
                <TableCell className="w-2/5 border-r border-zinc-300/20"
                  style={{ width: '50%', minWidth: '18rem' }}>
                  {pessoa.pesNome}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '20%', minWidth: '8rem' }}>
                  {pessoa.pesApelido}
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '10%', minWidth: '8rem' }}>
                  <Badge color="blue" variant="soft" className="border border-blue-700/20">{pessoa.pesNivel}</Badge>
                </TableCell>
                <TableCell className="border-r border-zinc-300/20"
                  style={{ width: '20%', minWidth: '12rem' }}>
                  {usuarios.find(u => u.usuId === pessoa.usuId)?.usuEmail || <span className="text-zinc-400 italic">(sem usuário)</span>}
                </TableCell>
                <TableCell className="w-28 flex gap-2"
                  style={{ width: '9rem', minWidth: '7rem' }}>
                  <button
                    className="text-zinc-600 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(pessoa)}
                  >
                    <Pencil size={18} />
                  </button>
                 
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
