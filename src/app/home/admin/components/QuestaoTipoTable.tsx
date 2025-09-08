import React, { useState, useMemo } from 'react';
import { Pencil, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface TipoQuestao {
  id: number;
  descricao: string;
  ativo: boolean;
}

import { questaoTipoService } from '@/services/questao/QuestaoTipoService';
import { FormNotification } from '../../../../components/ui/form-components/form-notification';

interface QuestaoTipoTableProps {
  tipos: TipoQuestao[];
  onEdit: (tipo: TipoQuestao) => void;
  setTipos?: (tipos: TipoQuestao[]) => void;
}

export function QuestaoTipoTable({ tipos, onEdit, setTipos }: QuestaoTipoTableProps) {
  type SortKey = 'id' | 'descricao' | 'ativo';
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const sorted = useMemo(() => {
    let data = [...tipos];
    data = data.sort((a, b) => {
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
  }, [tipos, sortKey, sortAsc]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const { success, error } = FormNotification;

  async function handleToggleAtivo(tipo: TipoQuestao) {
    try {
      const novoStatus = !tipo.ativo;
      // Always send the current description and new status
      await questaoTipoService.update(tipo.id, { quetDescricao: tipo.descricao, quetAtivo: novoStatus });
      if (setTipos) {
        setTipos(tipos.map(t => t.id === tipo.id ? { ...t, ativo: novoStatus } : t));
      }
      success({ message: `Tipo ${novoStatus ? 'ativado' : 'inativado'} com sucesso!` });
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao atualizar tipo!' });
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((asc) => !asc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('id')}>#</TableHead>
            <TableHead onClick={() => handleSort('descricao')}>Descrição</TableHead>
            <TableHead onClick={() => handleSort('ativo')}>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{t.descricao}</TableCell>
              <TableCell>
                {t.ativo ? (
                  <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                ) : (
                  <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                )}
              </TableCell>
              <TableCell>
                <button
                  className="text-zinc-600 hover:text-blue-500 p-1"
                  title="Editar"
                  onClick={() => onEdit(t)}
                >
                  <Pencil size={18} />
                </button>
                {t.ativo ? (
                  <button
                    className="text-red-700 hover:text-red-500 p-1"
                    title="Inativar"
                    onClick={() => handleToggleAtivo(t)}
                  >
                    <Ban size={18} />
                  </button>
                ) : (
                  <button
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Ativar"
                    onClick={() => handleToggleAtivo(t)}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalPages > 1 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex justify-end items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
                  <span>Página {page} de {totalPages}</span>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
