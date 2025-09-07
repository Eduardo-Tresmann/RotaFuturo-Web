import React from 'react';
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
import { Questao } from '@/types/questao';

type SortKey = 'questaoId' | 'questaoCodigo' | 'questaoDescricao' | 'questaoAtivo';
interface QuestaoTableContentProps {
  paginated: Questao[];
  page: number;
  totalPages: number;
  sortKey: SortKey;
  sortAsc: boolean;
  handleSort: (key: SortKey) => void;
  setPage: (page: number) => void;
  onEdit: (questao: Questao) => void;
  onInativar: (questao: Questao) => void;
}

export function QuestaoTableContent({
  paginated,
  page,
  totalPages,
  sortKey,
  sortAsc,
  handleSort,
  setPage,
  onEdit,
  onInativar,
}: QuestaoTableContentProps) {
  return (
    <Table>
      <TableCaption>Lista de questões do sistema</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort('questaoId')}>
            ID {sortKey === 'questaoId' && (sortAsc ? '▲' : '▼')}
          </TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Área</TableHead>
          <TableHead>Subárea</TableHead>
          <TableHead>Experiência</TableHead>
          <TableHead>Nível</TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('questaoAtivo')}>
            Ativo {sortKey === 'questaoAtivo' && (sortAsc ? '▲' : '▼')}
          </TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-gray-400">
              Nenhuma questão encontrada
            </TableCell>
          </TableRow>
        ) : (
          paginated.map((questao) => (
            <TableRow key={questao.questaoId}>
              <TableCell>{questao.questaoId}</TableCell>
              <TableCell>{questao.questaoCodigo}</TableCell>
              <TableCell>{questao.questaoDescricao}</TableCell>
              <TableCell>{questao.area?.areaDescricao ?? '-'}</TableCell>
              <TableCell>{questao.areaSub?.areasDescricao ?? '-'}</TableCell>
              <TableCell>{questao.questaoExperiencia ?? '-'}</TableCell>
              <TableCell>{questao.questaoNivel ?? '-'}</TableCell>
              <TableCell>
                <span
                  className={
                    questao.questaoAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                  }
                >
                  {questao.questaoAtivo ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                <button
                  className="text-blue-600 hover:bg-blue-100 rounded p-1 mr-2"
                  title="Editar"
                  onClick={() => onEdit(questao)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-600 hover:bg-red-100 rounded p-1"
                  title="Inativar"
                  onClick={() => onInativar(questao)}
                >
                  🗑️
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={9} className="text-center">
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
