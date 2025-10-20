'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageContent } from '@/components/admin/AdminPageContent';
import { DesafioTable } from './DesafioTable';
import { DesafioForm } from './DesafioForm';
import { desafioService, Desafio } from '@/services/desafioService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ModalState {
  tipo: 'inserir' | 'editar';
  data?: Desafio;
}

export function DesafiosAdminContent() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [filtros, setFiltros] = useState({ titulo: '', nivel: '' });

  async function refreshDesafios() {
    setLoading(true);
    try {
      const data = await desafioService.listarTodos();
      setDesafios(data);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshDesafios();
  }, []);

  async function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja excluir este desafio?')) {
      try {
        await desafioService.remover(id);
        await refreshDesafios();
      } catch (error) {
        console.error('Erro ao excluir desafio:', error);
        alert('Erro ao excluir desafio');
      }
    }
  }

  function handleEdit(desafio: Desafio) {
    setModal({ tipo: 'editar', data: desafio });
  }

  async function handleFormSubmit() {
    setModal(null);
    await refreshDesafios();
  }

  const desafiosFiltrados = desafios.filter((d) => {
    const matchTitulo =
      !filtros.titulo || d.desTitulo?.toLowerCase().includes(filtros.titulo.toLowerCase());
    const matchNivel =
      !filtros.nivel || d.nivel?.nivDescricao?.toLowerCase().includes(filtros.nivel.toLowerCase());
    return matchTitulo && matchNivel;
  });

  return (
    <>
      <AdminPageContent
        actionButtons={[
          <button
            key="inserir"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            onClick={() => setModal({ tipo: 'inserir' })}
          >
            Inserir Desafio
          </button>,
        ]}
        tabs={[{ label: 'Desafios', value: 'desafios' }]}
        currentTab="desafios"
        onTabChange={() => {}}
      >
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Filtrar por título..."
            className="px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtros.titulo}
            onChange={(e) => setFiltros({ ...filtros, titulo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filtrar por nível..."
            className="px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtros.nivel}
            onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">Carregando...</div>
        ) : (
          <DesafioTable desafios={desafiosFiltrados} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </AdminPageContent>

      {modal && (
        <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modal.tipo === 'inserir' ? 'Novo Desafio' : 'Editar Desafio'}
              </DialogTitle>
            </DialogHeader>
            <DesafioForm
              desafio={modal.data}
              onSubmit={handleFormSubmit}
              onCancel={() => setModal(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
