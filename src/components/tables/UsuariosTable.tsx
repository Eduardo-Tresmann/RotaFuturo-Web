import React, { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onInativar: (usuario: Usuario) => void;
}

export function UsuariosTable({ usuarios, onEdit, onInativar }: UsuariosTableProps) {
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
        u.usuEmail.toLowerCase().includes(search.toLowerCase()) || String(u.usuId).includes(search);
      // Filtros avançados
      const matchId = filterId ? String(u.usuId) === filterId : true;
      const matchEmail = filterEmail
        ? u.usuEmail.toLowerCase().includes(filterEmail.toLowerCase())
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
    <div>
      <div className="flex items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtro'}
        </button>
      </div>
      {showFilters && (
  <div className="mb-4 p-4 bg-gray-50 rounded-md shadow flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">ID</label>
            <input
              type="number"
              value={filterId}
              onChange={(e) => {
                setFilterId(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 w-24"
              placeholder="ID"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">E-mail</label>
            <input
              type="text"
              value={filterEmail}
              onChange={(e) => {
                setFilterEmail(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 w-40"
              placeholder="E-mail"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Ativo</label>
            <select
              value={filterAtivo}
              onChange={(e) => {
                setFilterAtivo(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 w-24"
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Email Validado</label>
            <select
              value={filterValidado}
              onChange={(e) => {
                setFilterValidado(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 w-24"
            >
              <option value="">Todos</option>
              <option value="true">Validado</option>
              <option value="false">Não validado</option>
            </select>
          </div>
        </div>
      )}
  <div className="overflow-auto rounded-md border-2 border-zinc-300 bg-white shadow-lg">
        <table className="min-w-full text-sm font-inter border-separate border-spacing-0">
          <caption className="text-zinc-500 text-xs py-2">Lista de usuários do sistema</caption>
          <thead className="sticky top-0 bg-zinc-800 z-10">
            <tr>
              <th
                className="px-4 py-3 text-left font-bold text-white border-b border-r border-zinc-300 cursor-pointer select-none"
                onClick={() => handleSort('usuId')}
              >
                ID {sortKey === 'usuId' && (sortAsc ? '▲' : '▼')}
              </th>
              <th
                className="px-4 py-3 text-left font-bold text-white border-b border-r border-zinc-300 cursor-pointer select-none"
                onClick={() => handleSort('usuEmail')}
              >
                E-mail {sortKey === 'usuEmail' && (sortAsc ? '▲' : '▼')}
              </th>
              <th
                className="px-4 py-3 text-left font-bold text-white border-b border-r border-zinc-300 cursor-pointer select-none"
                onClick={() => handleSort('usuAtivo')}
              >
                Ativo {sortKey === 'usuAtivo' && (sortAsc ? '▲' : '▼')}
              </th>
              <th
                className="px-4 py-3 text-left font-bold text-white border-b border-r border-zinc-300 cursor-pointer select-none"
                onClick={() => handleSort('usuEmailValidado')}
              >
                Email Validado {sortKey === 'usuEmailValidado' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3 text-left font-bold text-white border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-zinc-400 py-8">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              paginated.map((usuario, idx) => (
                <tr
                  key={usuario.usuId}
                  className={idx % 2 === 0 ? 'bg-zinc-100' : 'bg-white hover:bg-blue-50 transition'}
                >
                  <td className="px-4 py-3 border-b border-r border-zinc-200">{usuario.usuId}</td>
                  <td className="px-4 py-3 border-b border-r border-zinc-200">
                    {usuario.usuEmail}
                  </td>
                  <td className="px-4 py-3 border-b border-r border-zinc-200">
                    <span
                      className={
                        usuario.usuAtivo ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                      }
                    >
                      {usuario.usuAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-r border-zinc-200">
                    <span
                      className={usuario.usuEmailValidado ? 'text-green-600' : 'text-yellow-600'}
                    >
                      {usuario.usuEmailValidado ? 'Validado' : 'Não validado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex flex-row gap-2">
                      <button
                        className="text-blue-600 hover:bg-blue-100 rounded-md p-1 transition flex items-center justify-center"
                        title="Editar"
                        onClick={() => onEdit(usuario)}
                      >
                        <Pencil size={18} strokeWidth={2.2} />
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-100 rounded-md p-1 transition flex items-center justify-center"
                        title="Inativar"
                        onClick={() => onInativar(usuario)}
                      >
                        <Trash2 size={18} strokeWidth={2.2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="text-center py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 py-1 rounded-md bg-zinc-200 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="px-2 py-1 rounded-md bg-zinc-200 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
