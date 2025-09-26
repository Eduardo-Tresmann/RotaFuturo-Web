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
import { Teste } from '@/services/teste/TesteService';

interface TesteTableProps {
  testes: Teste[];
  onEdit: (teste: Teste) => void;
  onInativar: (teste: Teste) => void;
}

export function TesteTable({ testes, onEdit }: TesteTableProps) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    return testes.filter(
      (t) =>
        t.tesDescricao.toLowerCase().includes(search.toLowerCase()) ||
        String(t.tesId).includes(search),
    );
  }, [testes, search]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((teste) => (
            <TableRow key={teste.tesId}>
              <TableCell>{teste.tesId}</TableCell>
              <TableCell>{teste.tesDescricao}</TableCell>
              <TableCell>
                <button onClick={() => onEdit(teste)} className="mr-2 text-blue-600">
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
