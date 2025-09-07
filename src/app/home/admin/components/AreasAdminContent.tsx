import React, { useEffect, useState } from 'react';
import { Filter, BrushCleaning } from 'lucide-react';
import AreaForm from '@/app/home/admin/components/AreaForm';
import AreaSubForm from '@/app/home/admin/components/AreaSubForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AreaTable } from '@/app/home/admin/components/AreaTable';
import { AreaSubTable } from '@/app/home/admin/components/AreaSubTable';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { AreaSub } from '@/types/areasub';
import { areaService } from '@/services/area/AreaService';
import { Area } from '@/types/area';

export function AreasAdminContent() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaSubs, setAreaSubs] = useState<AreaSub[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState<'area' | 'subarea' | 'editSubarea' | 'editArea' | null>(null);
  const [tab, setTab] = useState<'areas' | 'subareas'>('areas');
  const [editingSubarea, setEditingSubarea] = useState<AreaSub | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  // Filtros locais
  const [areaFilter, setAreaFilter] = useState({ descricao: '', ativo: false });
  const [subFilter, setSubFilter] = useState({ descricao: '', area: '', ativo: false });

  async function refreshAreas() {
    try {
      const data = await areaService.listAll();
      setAreas(data);
    } catch {
      setAreas([]);
    }
  }
  async function refreshAreaSubs() {
    try {
      const data = await areaSubService.listAll();
      setAreaSubs(data);
    } catch {
      setAreaSubs([]);
    }
  }

  async function handleEditSubarea(sub: AreaSub) {
    setEditingSubarea(sub);
    setModal('editSubarea');
  }

  async function handleInativarSubarea(sub: AreaSub) {
    if (sub.areasAtivo) {
      await areaSubService.inativar(sub.areasId);
    } else {
      await areaSubService.update(sub.areasId, { areasAtivo: true });
    }
    refreshAreaSubs();
  }
  async function handleEditArea(area: Area) {
    setEditingArea(area);
    setModal('editArea');
  }

  useEffect(() => { refreshAreas(); refreshAreaSubs(); }, []);
  return (
    <div className="flex flex-col gap-1 w-full ">
      <div className="flex flex-wrap items-center gap-2 mb-4 justify-between ">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => setModal('area')}
          >
            Criar Área
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => setModal('subarea')}
          >
            Criar SubÁrea
          </button>
        </div>
      </div>
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tab === 'areas' ? 'Filtro' : 'Filtro'}
              </DialogTitle>
            </DialogHeader>
            {tab === 'areas' ? (
              <form
                className="flex flex-col gap-4 py-2"
                onSubmit={e => {
                  e.preventDefault();
                  setShowFilters(false);
                }}
              >
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700">Descrição da Área</span>
                  <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="Buscar por descrição..."
                    value={areaFilter.descricao}
                    onChange={e => setAreaFilter(f => ({ ...f, descricao: e.target.value }))}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={areaFilter.ativo}
                    onChange={e => setAreaFilter(f => ({ ...f, ativo: e.target.checked }))}
                  />
                  <span className="text-sm text-zinc-700">Somente áreas ativas</span>
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
                  setShowFilters(false);
                }}
              >
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700">Descrição da Subárea</span>
                  <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="Buscar por descrição..."
                    value={subFilter.descricao}
                    onChange={e => setSubFilter(f => ({ ...f, descricao: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700">Área vinculada</span>
                  <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="Buscar por área..."
                    value={subFilter.area}
                    onChange={e => setSubFilter(f => ({ ...f, area: e.target.value }))}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={subFilter.ativo}
                    onChange={e => setSubFilter(f => ({ ...f, ativo: e.target.checked }))}
                  />
                  <span className="text-sm text-zinc-700">Somente subáreas ativas</span>
                </label>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300" onClick={() => setShowFilters(false)}>Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Filtrar</button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      <Dialog open={modal === 'area'} onOpenChange={open => setModal(open ? 'area' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Área</DialogTitle>
          </DialogHeader>
          <AreaForm onCreated={() => {
            setModal(null);
            refreshAreas();
          }} />
        </DialogContent>
      </Dialog>
      <Dialog open={modal === 'editArea'} onOpenChange={open => { if (!open) { setModal(null); setEditingArea(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Área</DialogTitle>
          </DialogHeader>
          {editingArea && (
            <AreaForm
              area={editingArea}
              onCreated={() => { setModal(null); setEditingArea(null); refreshAreas(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={modal === 'subarea'} onOpenChange={open => setModal(open ? 'subarea' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar SubÁrea</DialogTitle>
          </DialogHeader>
          <AreaSubForm onCreated={() => { setModal(null); refreshAreaSubs(); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={modal === 'editSubarea'} onOpenChange={open => { if (!open) { setModal(null); setEditingSubarea(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar SubÁrea</DialogTitle>
          </DialogHeader>
          {editingSubarea && (
            <AreaSubForm
              subarea={editingSubarea}
              onCreated={() => { setModal(null); setEditingSubarea(null); refreshAreaSubs(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors ${tab === 'areas' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-zinc-500 bg-zinc-100'}`}
              onClick={() => setTab('areas')}
            >
              Áreas
            </button>
            <button
              className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors ${tab === 'subareas' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-zinc-500 bg-zinc-100'}`}
              onClick={() => setTab('subareas')}
            >
              Subáreas
            </button>
          </div>
          <div className="relative flex items-center">
            <div className="relative">
              <button
                className="px-4 pr-9 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 flex items-center gap-2"
                onClick={() => setShowFilters(true)}
                style={{ minWidth: 160 }}
              >
                <Filter size={18} />
                Filtro
              </button>
              {(
                (tab === 'areas' && (areaFilter.descricao || areaFilter.ativo)) ||
                (tab === 'subareas' && (subFilter.descricao || subFilter.area || subFilter.ativo))
              ) && (
                <button
                  className="text-zinc-300 p-2 rounded bg-zinc-600 hover:bg-zinc-500 focus:outline-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center"
                  title="Limpar filtros"
                  tabIndex={0}
                  type="button"
                  style={{ pointerEvents: 'auto' }}
                  onClick={e => {
                    e.stopPropagation();
                    if (tab === 'areas') setAreaFilter({ descricao: '', ativo: false });
                    else setSubFilter({ descricao: '', area: '', ativo: false });
                  }}
                >
                  <BrushCleaning size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full overflow-auto shadow-lg rounded-xl bg-white">
          <div className="min-w-full">
            {tab === 'areas' ? (
              <AreaTable
                areas={areas.filter(a => {
                  const descMatch = (a.areaDescricao || '').toLowerCase().includes((areaFilter.descricao || '').toLowerCase());
                  const ativoMatch = !areaFilter.ativo || a.areaAtivo;
                  return descMatch && ativoMatch;
                })}
                onEdit={handleEditArea}
                onInativar={() => {}}
                onAreaCreated={refreshAreas}
                columnWidths={{ id: '2%', situacao: '5%', acoes: '10%' }}
              />
            ) : (
              <AreaSubTable
                areaSubs={areaSubs.filter(s => {
                  const descMatch = (s.areasDescricao || '').toLowerCase().includes((subFilter.descricao || '').toLowerCase());
                  const ativoMatch = !subFilter.ativo || s.areasAtivo;
                  // Busca área vinculada pelo nome
                  let areaMatch = true;
                  if (subFilter.area) {
                    const areaObj = areas.find(a => a.areaId === s.areaId);
                    areaMatch = areaObj ? (areaObj.areaDescricao || '').toLowerCase().includes((subFilter.area || '').toLowerCase()) : false;
                  }
                  return descMatch && ativoMatch && areaMatch;
                })}
                onEdit={handleEditSubarea}
                onInativar={handleInativarSubarea}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
