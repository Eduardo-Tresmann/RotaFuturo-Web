import React, { useState, useMemo } from 'react';
import { Pencil, Ban } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { TesteQuestao } from '@/services/teste/TesteService';
interface TesteQuestaoTableProps {
  questoes: TesteQuestao[];
  onEdit: (questao: TesteQuestao) => void;
  onInativar: (questao: TesteQuestao) => void;
}
export function TesteQuestaoTable({ questoes, onEdit, onInativar }: TesteQuestaoTableProps) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    return questoes.filter(
      (q) =>
        q.tesqDescricao.toLowerCase().includes(search.toLowerCase()) ||
        String(q.tesqId).includes(search),
    );
  }, [questoes, search]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Teste Vinculado</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((q) => (
            <TableRow key={q.tesqId}>
              <TableCell>{q.tesqId}</TableCell>
              <TableCell>{q.tesqDescricao}</TableCell>
              <TableCell>{q.testeDescricao || ''}</TableCell>
              <TableCell>
                <button onClick={() => onEdit(q)} className="mr-2 text-blue-600">
                  <Pencil size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
