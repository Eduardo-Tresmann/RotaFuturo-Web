import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
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
import { Usuario } from '@/types/usuario';
import { Pagination } from '@/components/ui/pagination';

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onInativar: (usuario: Usuario) => void;
}

import { usuarioService } from '@/services/usuario/UsuarioService';
import { FormNotification } from '@/components/ui/form-components/form-notification';
export function UsuariosTable({ usuarios, onEdit, onInativar, onRefresh }: UsuariosTableProps & { onRefresh?: () => void }) {
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('');
  const [filterValidado, setFilterValidado] = useState('');
  // Ordenação
  type SortKey = 'usuId' | 'usuEmail' | 'usuAtivo' | 'usuEmailValidado';
  const [sortKey, setSortKey] = useState<SortKey>('usuId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  // Paginação
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Filtro e ordenação
  const filtered = useMemo(() => {
    let data = usuarios.filter((u: Usuario) => {
      // Busca simples
      const matchSearch =
        (u.usuEmail || '').toLowerCase().includes((search || '').toLowerCase()) || String(u.usuId).includes(search);
      // Filtros avançados
      const matchId = filterId ? String(u.usuId) === filterId : true;
      const matchEmail = filterEmail
        ? (u.usuEmail || '').toLowerCase().includes((filterEmail || '').toLowerCase())
        : true;
      const matchAtivo = filterAtivo ? String(u.usuAtivo) === filterAtivo : true;
      const matchValidado = filterValidado ? String(u.usuEmailValidado) === filterValidado : true;
      return matchSearch && matchId && matchEmail && matchAtivo && matchValidado;
    });
    data = [...data].sort((a, b) => {
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
  }, [usuarios, search, sortKey, sortAsc, filterId, filterEmail, filterAtivo, filterValidado]);

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
              onClick={() => handleSort('usuId')}
            >
              # {sortKey === 'usuId' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('usuEmail')}
            >
              E-mail {sortKey === 'usuEmail' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('usuAtivo')}
            >
              Situação {sortKey === 'usuAtivo' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              onClick={() => handleSort('usuEmailValidado')}
            >
              E-mail Validado {sortKey === 'usuEmailValidado' && (sortAsc ? '▲' : '▼')}
            </TableHead>
            <TableHead >
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-zinc-400">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((usuario) => (
              <TableRow
                key={usuario.usuId}
                className={'hover:bg-zinc-50'}
              >
                <TableCell>{usuario.usuId}</TableCell>
                <TableCell>{usuario.usuEmail}</TableCell>
                <TableCell>
                  {usuario.usuAtivo ? (
                    <Badge color="green" variant="solid" className="shadow-md border border-green-700/30">Ativo</Badge>
                  ) : (
                    <Badge color="red" variant="solid" className="shadow-md border border-red-700/30">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {usuario.usuEmailValidado ? (
                    <Badge color="green" variant="soft" className="border border-green-700/20">Validado</Badge>
                  ) : (
                    <Badge color="yellow" variant="soft" className="border border-yellow-700/20">Não validado</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    className="text-zinc-600 dark:text-zinc-200 hover:text-blue-500 p-1"
                    title="Editar"
                    onClick={() => onEdit(usuario)}
                  >
                    <Pencil size={18} />
                  </button>
                  {usuario.usuAtivo ? (
                    <button
                      className="text-red-700 hover:text-red-500 p-1"
                      title="Inativar"
                      onClick={async () => {
                        await usuarioService.inativarUser(usuario.usuId);
                        FormNotification.success({ message: 'Usuário inativado com sucesso!' });
                        if (onRefresh) onRefresh();
                      }}
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Ativar"
                      onClick={async () => {
                        await usuarioService.updateUser(usuario.usuId, { ...usuario, usuAtivo: true });
                        FormNotification.success({ message: 'Usuário ativado com sucesso!' });
                        if (onRefresh) onRefresh();
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
