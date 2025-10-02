'use client';
import { useState, useEffect } from 'react';
import { stateService } from '@/services/stateService';
import { grupoAcessoUsuarioService } from '@/services/grupo/GrupoAcessoUsuarioService';
export function useGrupoAcesso(usuarioId: number | null) {
  const [grupos, setGrupos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const carregarGrupos = async () => {
      if (!usuarioId) {
        setGrupos([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const cachedGrupos = stateService.get<string[]>(`user_groups_${usuarioId}`);
        if (cachedGrupos) {
          setGrupos(cachedGrupos);
          setIsAdmin(cachedGrupos.indexOf('ADMINISTRADOR') !== -1);
        } else {
          const grupos = await grupoAcessoUsuarioService.listarGruposDoUsuario(usuarioId);
          setGrupos(grupos);
          setIsAdmin(grupos.indexOf('ADMINISTRADOR') !== -1);
          stateService.set(`user_groups_${usuarioId}`, grupos);
        }
      } catch (error) {
        console.error('Erro ao carregar grupos de acesso:', error);
        setGrupos([]);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    carregarGrupos();
  }, [usuarioId]);
  const temPermissao = (grupoNecessario: string): boolean => {
    return grupos.indexOf(grupoNecessario) !== -1;
  };
  const recarregarGrupos = async () => {
    if (!usuarioId) return;
    try {
      setLoading(true);
      const grupos = await grupoAcessoUsuarioService.listarGruposDoUsuario(usuarioId);
      setGrupos(grupos);
      setIsAdmin(grupos.indexOf('ADMINISTRADOR') !== -1);
      stateService.set(`user_groups_${usuarioId}`, grupos);
    } catch (error) {
      console.error('Erro ao recarregar grupos de acesso:', error);
    } finally {
      setLoading(false);
    }
  };
  return {
    grupos,
    isAdmin,
    loading,
    temPermissao,
    recarregarGrupos,
  };
}
