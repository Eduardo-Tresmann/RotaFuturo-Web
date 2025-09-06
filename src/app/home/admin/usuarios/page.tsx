'use client';
import React from 'react';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { UsuariosTable } from '@/components/tables/UsuariosTable';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { useEffect, useState } from 'react';
import { Usuario } from '@/types/usuario';
import UsuarioForm from '@/components/forms/UsuarioForm';

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editing, setEditing] = useState<Usuario | null>(null);
  useEffect(() => {
    usuarioService
      .listAll()
      .then(setUsuarios)
      .catch(() => setUsuarios([]));
  }, []);
  function handleEdit(usuario: Usuario) {
    setEditing(usuario);
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

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-10 w-full">
        <UsuariosTable usuarios={usuarios} onEdit={handleEdit} onInativar={handleInativar} />
        {editing && (
          <div className="mt-8">
            <UsuarioForm usuario={editing ?? undefined} onClose={() => setEditing(null)} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
