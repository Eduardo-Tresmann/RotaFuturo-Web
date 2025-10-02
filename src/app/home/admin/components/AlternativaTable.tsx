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
import { Badge } from '@/components/ui/Badge';
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
      <Table >
        <TableHeader>
          <TableRow className="bg-zinc-300/70">
            <TableHead
              onClick={() => handleSort('quesaId')}
            >
              # {sortKey === 'quesaId' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('questaoCodigo')}
            >
              Código {sortKey === 'questaoCodigo' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('quesaDescricao')}
            >
              Descrição {sortKey === 'quesaDescricao' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('quesaCorreta')}
            >
              Correta {sortKey === 'quesaCorreta' && (sortAsc ? '\u25b2' : '\u25bc')}
            </TableHead>
            <TableHead>
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
                <TableRow key={a.quesaId}>
                <TableCell>{a.quesaId}</TableCell>
                <TableCell>{a.questao?.questaoCodigo || a.questao?.questaoId}</TableCell>
                <TableCell>{a.quesaDescricao}</TableCell>
                <TableCell>
                  {a.quesaCorreta === 1 ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">SIM</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">NÃO</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <button className=" mr-2" onClick={() => onEdit(a)} title="Editar"><Pencil size={18} /></button>
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
