import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminPageContent } from '@/components/admin/AdminPageContent';
import { CursoTable } from './CursoTable';
import { MateriaTable } from './MateriaTable';
import CursoForm from './CursoForm';
import MateriaForm from './MateriaForm';
import { cursoService } from '@/services/curso/CursoService';
import { materiaService } from '@/services/materia/MateriaService';
import { Curso } from '@/types/curso';
import { Materia } from '@/types/materia';
export function CursosMateriasAdminContent() {
  const [cursoModal, setCursoModal] = useState<'criar' | 'editar' | null>(null);
  async function refreshMaterias() {
    const data = await materiaService.listAll();
    setMaterias(data);
  }
  const [tab, setTab] = useState<'cursos' | 'materias'>('cursos');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [cursoFilter, setCursoFilter] = useState({ descricao: '', ativo: '' });
  const [showCursoFilter, setShowCursoFilter] = useState(false);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiaModal, setMateriaModal] = useState<'criar' | 'editar' | null>(null);
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null);
  const [materiaFilter, setMateriaFilter] = useState({ descricao: '', ativo: '' });
  const [showMateriaFilter, setShowMateriaFilter] = useState(false);
  async function refreshCursos() {
  const data = await cursoService.listAll();
  setCursos(data);
  }
  useEffect(() => {
    refreshCursos();
    refreshMaterias();
  }, []);
  return (
    <AdminPageContent
      actionButtons={[
        <button
          key="novo-curso"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          onClick={() => { setEditingCurso(null); setCursoModal('criar'); }}
        >
          Criar Curso
        </button>,
        <button
          key="nova-materia"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          onClick={() => { setEditingMateria(null); setMateriaModal('criar'); }}
        >
          Criar Matéria
        </button>
      ]}
      tabs={[
        { label: 'Cursos', value: 'cursos' },
        { label: 'Matérias', value: 'materias' }
      ]}
      currentTab={tab}
  onTabChange={tab => setTab(tab as 'cursos' | 'materias')}
      filterButton={
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors bg-zinc-800 text-white hover:bg-zinc-700 ${
            (tab === 'cursos' && (cursoFilter.descricao || cursoFilter.ativo)) ||
            (tab === 'materias' && (materiaFilter.descricao || materiaFilter.ativo))
              ? 'ring-2 ring-blue-500 text-blue-500 bg-white hover:bg-zinc-100 border border-blue-500'
              : ''
          }`}
          onClick={() => tab === 'cursos' ? setShowCursoFilter(true) : setShowMateriaFilter(true)}
          style={{ minWidth: 120 }}
        >
          <Filter size={18} className={
            (tab === 'cursos' && (cursoFilter.descricao || cursoFilter.ativo)) ||
            (tab === 'materias' && (materiaFilter.descricao || materiaFilter.ativo))
              ? 'text-blue-500' : ''
          } />
          Filtro
        </button>
      }
      filterModal={
        <Dialog open={tab === 'cursos' ? showCursoFilter : showMateriaFilter} onOpenChange={tab === 'cursos' ? setShowCursoFilter : setShowMateriaFilter}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtro</DialogTitle>
            </DialogHeader>
            {tab === 'cursos' ? (
              <form className="flex flex-col gap-4 py-2" onSubmit={e => { e.preventDefault(); setShowCursoFilter(false); }}>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Descrição</span>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
                    placeholder="Buscar por descrição..."
                    value={cursoFilter.descricao}
                    onChange={e => setCursoFilter(f => ({ ...f, descricao: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Ativo</span>
                  <select
                    className="border rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100"
                    value={cursoFilter.ativo}
                    onChange={e => setCursoFilter(f => ({ ...f, ativo: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    onClick={() => setCursoFilter({ descricao: '', ativo: '' })}
                  >
                    Limpar filtros
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 border border-zinc-300 dark:bg-neutral-700 dark:text-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-600"
                    onClick={() => setShowCursoFilter(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Filtrar
                  </button>
                </div>
              </form>
            ) : (
              <form className="flex flex-col gap-4 py-2" onSubmit={e => { e.preventDefault(); setShowMateriaFilter(false); }}>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Descrição</span>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
                    placeholder="Buscar por descrição..."
                    value={materiaFilter.descricao}
                    onChange={e => setMateriaFilter(f => ({ ...f, descricao: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Ativo</span>
                  <select
                    className="border rounded px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100"
                    value={materiaFilter.ativo}
                    onChange={e => setMateriaFilter(f => ({ ...f, ativo: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    onClick={() => setMateriaFilter({ descricao: '', ativo: '' })}
                  >
                    Limpar filtros
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 border border-zinc-300 dark:bg-neutral-700 dark:text-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-600"
                    onClick={() => setShowMateriaFilter(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Filtrar
                  </button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      }
    >
      {}
      <Dialog open={cursoModal !== null} onOpenChange={open => { if (!open) { setCursoModal(null); setEditingCurso(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCurso ? 'Editar Curso' : 'Criar Curso'}</DialogTitle>
          </DialogHeader>
          <CursoForm
            key={editingCurso?.curId || 'novo'}
            curso={editingCurso ?? undefined}
            onClose={async () => { setCursoModal(null); setEditingCurso(null); await refreshCursos(); }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={materiaModal !== null} onOpenChange={open => { if (!open) { setMateriaModal(null); setEditingMateria(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMateria ? 'Editar Matéria' : 'Criar Matéria'}</DialogTitle>
          </DialogHeader>
          <MateriaForm
            key={editingMateria?.matId || 'novo'}
            materia={editingMateria ?? undefined}
            onClose={async () => { setMateriaModal(null); setEditingMateria(null); await refreshMaterias(); }}
          />
        </DialogContent>
      </Dialog>
      {}
      {tab === 'cursos' ? (
        <CursoTable
          cursos={cursos.filter(c => {
            const descMatch = (c.curDescricao || '').toLowerCase().includes((cursoFilter.descricao || '').toLowerCase());
            const ativoMatch = cursoFilter.ativo === '' ? true : String(c.curAtivo) === cursoFilter.ativo;
            return descMatch && ativoMatch;
          })}
          onEdit={curso => { setEditingCurso(curso); setCursoModal('editar'); }}
          onInativar={async () => { await refreshCursos(); }}
          onRefresh={refreshCursos}
        />
      ) : (
        <MateriaTable
          materias={materias.filter(m => {
            const descMatch = m.matDescricao.toLowerCase().includes((materiaFilter.descricao || '').toLowerCase());
            const ativoMatch = materiaFilter.ativo === '' ? true : String(m.matAtivo) === materiaFilter.ativo;
            return descMatch && ativoMatch;
          })}
          onEdit={materia => { setEditingMateria(materia); setMateriaModal('editar'); }}
          onRefresh={refreshMaterias}
        />
      )}
    </AdminPageContent>
  );
}
