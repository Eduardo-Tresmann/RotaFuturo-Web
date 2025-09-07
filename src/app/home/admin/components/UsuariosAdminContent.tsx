import React, { useEffect, useState } from 'react';
import { Filter, BrushCleaning } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { UsuariosTable } from '@/app/home/admin/components/UsuariosTable';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { Usuario } from '@/types/usuario';
import UsuarioForm from '@/app/home/admin/components/UsuarioForm';

import { Pessoa } from '@/types/pessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { PessoaTable } from './PessoaTable';
import PessoaForm from './PessoaForm';

export function UsuariosAdminContent() {
  const [tab, setTab] = useState<'usuarios' | 'pessoas'>('usuarios');
  // Usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState<'criar' | 'editar' | null>(null);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [userFilter, setUserFilter] = useState({ email: '', ativo: false, validado: false });
  // Pessoas
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [showPessoaFilters, setShowPessoaFilters] = useState(false);
  const [pessoaFilter, setPessoaFilter] = useState({ nome: '', apelido: '', nivel: '', ativo: false });
  const [pessoaModal, setPessoaModal] = useState<'criar' | 'editar' | null>(null);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);

  useEffect(() => {
    usuarioService
      .listAll()
      .then(setUsuarios)
      .catch(() => setUsuarios([]));
    pessoaService
      .listAll?.()
      .then(setPessoas)
      .catch(() => setPessoas([]));
  }, []);

  function handleEdit(usuario: Usuario) {
    setEditing(usuario);
    setModal('editar');
  }

  async function handleInativar(usuario: Usuario) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para inativar usuários.');
      return;
    }
    if (window.confirm(`Confirma inativar o usuário ${usuario.usuEmail}?`)) {
      try {
        const atualizado = await usuarioService.inativarUser(usuario.usuId);
        setUsuarios((prev) => prev.map((u) => (u.usuId === atualizado.usuId ? atualizado : u)));
      } catch (e) {
        alert('Erro ao inativar usuário');
      }
    }
  }

  // Estrutura visual com abas
  return (
    <div className="flex flex-col gap-6 w-full font-montserrat">
      <div className="flex flex-wrap items-center gap-2 mb-4 justify-between ">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => { setEditing(null); setModal('criar'); }}
          >
            Criar Usuário
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => { setEditingPessoa(null); setPessoaModal('criar'); }}
          >
            Criar Pessoa
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors ${tab === 'usuarios' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-zinc-500 bg-zinc-100'}`}
            onClick={() => setTab('usuarios')}
          >
            Usuários
          </button>
          <button
            className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors ${tab === 'pessoas' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-zinc-500 bg-zinc-100'}`}
            onClick={() => setTab('pessoas')}
          >
            Pessoas
          </button>
        </div>
        <div className="relative flex items-center">
          <button
            className="px-4 pr-9 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 flex items-center gap-2 relative"
            onClick={() => tab === 'usuarios' ? setShowFilters(true) : setShowPessoaFilters(true)}
            style={{ minWidth: 160 }}
          >
            <Filter size={18} />
            Filtro
            {(tab === 'usuarios' && (userFilter.email || userFilter.ativo || userFilter.validado)) && (
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center"
                style={{ pointerEvents: 'auto' }}
              >
                <button
                  className="p-2 rounded bg-zinc-600 hover:bg-zinc-500 focus:outline-none"
                  title="Limpar filtros"
                  tabIndex={0}
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setUserFilter({ email: '', ativo: false, validado: false });
                  }}
                >
                  <BrushCleaning size={18} />
                </button>
              </span>
            )}
            {(tab === 'pessoas' && (pessoaFilter.nome || pessoaFilter.apelido || pessoaFilter.nivel || pessoaFilter.ativo)) && (
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center"
                style={{ pointerEvents: 'auto' }}
              >
                <button
                  className="p-2 rounded bg-zinc-600 hover:bg-zinc-500 focus:outline-none"
                  title="Limpar filtros"
                  tabIndex={0}
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setPessoaFilter({ nome: '', apelido: '', nivel: '', ativo: false });
                  }}
                >
                  <BrushCleaning size={18} />
                </button>
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Filtros dinâmicos por aba */}
      <Dialog open={tab === 'usuarios' ? showFilters : showPessoaFilters} onOpenChange={tab === 'usuarios' ? setShowFilters : setShowPessoaFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtro</DialogTitle>
          </DialogHeader>
          {tab === 'usuarios' ? (
            <form
              className="flex flex-col gap-4 py-2"
              onSubmit={e => {
                e.preventDefault();
                setShowFilters(false);
              }}
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">E-mail</span>
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  placeholder="Buscar por e-mail..."
                  value={userFilter.email}
                  onChange={e => setUserFilter(f => ({ ...f, email: e.target.value }))}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={userFilter.ativo}
                  onChange={e => setUserFilter(f => ({ ...f, ativo: e.target.checked }))}
                />
                <span className="text-sm text-zinc-700">Somente usuários ativos</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={userFilter.validado}
                  onChange={e => setUserFilter(f => ({ ...f, validado: e.target.checked }))}
                />
                <span className="text-sm text-zinc-700">Somente e-mails validados</span>
              </label>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300" onClick={() => setShowFilters(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Filtrar</button>
              </div>
            </form>
          ) : (
            <form
              className="flex flex-col gap-4 py-2"
              onSubmit={e => {
                e.preventDefault();
                setShowPessoaFilters(false);
              }}
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">Nome</span>
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  placeholder="Buscar por nome..."
                  value={pessoaFilter.nome}
                  onChange={e => setPessoaFilter(f => ({ ...f, nome: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">Apelido</span>
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  placeholder="Buscar por apelido..."
                  value={pessoaFilter.apelido}
                  onChange={e => setPessoaFilter(f => ({ ...f, apelido: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">Nível</span>
                <input
                  type="number"
                  className="border rounded px-3 py-2"
                  placeholder="Buscar por nível..."
                  value={pessoaFilter.nivel}
                  onChange={e => setPessoaFilter(f => ({ ...f, nivel: e.target.value }))}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={pessoaFilter.ativo}
                  onChange={e => setPessoaFilter(f => ({ ...f, ativo: e.target.checked }))}
                />
                <span className="text-sm text-zinc-700">Somente pessoas ativas</span>
              </label>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300" onClick={() => setShowPessoaFilters(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Filtrar</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* Conteúdo das tabelas */}
      {tab === 'usuarios' ? (
        <>
                        <Dialog open={modal !== null} onOpenChange={open => { if (!open) { setModal(null); setEditing(null); } }}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{editing ? 'Editar Usuário' : 'Criar Usuário'}</DialogTitle>
                            </DialogHeader>
                            <UsuarioForm usuario={editing ?? undefined} onClose={() => { setModal(null); setEditing(null); }} />
                          </DialogContent>
                        </Dialog>
                        <div className="relative w-full overflow-auto shadow-lg rounded-xl bg-white">
                          <div className="min-w-full">
                            <UsuariosTable
                              usuarios={usuarios.filter(u => {
                                const emailMatch = (u.usuEmail || '').toLowerCase().includes((userFilter.email || '').toLowerCase());
                                const ativoMatch = !userFilter.ativo || u.usuAtivo;
                                const validadoMatch = !userFilter.validado || u.usuEmailValidado;
                                return emailMatch && ativoMatch && validadoMatch;
                              })}
                              onEdit={handleEdit}
                              onInativar={handleInativar}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <PessoaTable
                          pessoas={pessoas.filter(p => {
                            const nomeMatch = (p.pesNome || '').toLowerCase().includes((pessoaFilter.nome || '').toLowerCase());
                            const apelidoMatch = (p.pesApelido || '').toLowerCase().includes((pessoaFilter.apelido || '').toLowerCase());
                            const nivelMatch = pessoaFilter.nivel ? String(p.pesNivel) === pessoaFilter.nivel : true;
                            return nomeMatch && apelidoMatch && nivelMatch;
                          })}
                          usuarios={usuarios.map(u => ({ usuId: u.usuId, usuEmail: u.usuEmail }))}
                          onEdit={pessoa => { setEditingPessoa(pessoa); setPessoaModal('editar'); }}
                          onInativar={() => { /* TODO: inativar pessoa */ }}
                        />
                        <Dialog open={pessoaModal !== null} onOpenChange={open => { if (!open) { setPessoaModal(null); setEditingPessoa(null); } }}>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{editingPessoa ? 'Editar Pessoa' : 'Criar Pessoa'}</DialogTitle>
                            </DialogHeader>
                            <PessoaForm
                              pessoa={editingPessoa ?? undefined}
                              onClose={() => { setPessoaModal(null); setEditingPessoa(null); }}
                              onSaved={async () => {
                                setPessoaModal(null); setEditingPessoa(null);
                                const data = await pessoaService.listAll();
                                setPessoas(data);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
    </div>
  );
}
