import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { grupoAcessoUsuarioService } from '@/services/grupo/GrupoAcessoUsuarioService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomToast } from '@/components/ui/form-components/custom-toast';
import { useAuthContext } from '@/components/context/AuthContext';
export function GrupoAcessoAdminContent() {
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const { usuario } = useAuthContext();
  const setupGrupoAdmin = async () => {
    setLoading(true);
    try {
      const response = await grupoAcessoUsuarioService.inicializarGrupos();
      toast.success(response);
    } catch (error: any) {
      toast.error(`Erro ao configurar grupo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const associarUsuarioAdmin = async () => {
    if (!usuario?.usuId) {
      toast.error('Usuário não autenticado');
      return;
    }
    setLoading(true);
    try {
      const response = await grupoAcessoUsuarioService.associarAdmin(usuario.usuId);
      toast.success(response);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast.error(`Erro ao associar usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Grupos de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={setupGrupoAdmin}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Inicializar Grupo Administrador
            </Button>
            <Button
              onClick={associarUsuarioAdmin}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Tornar-me Administrador
            </Button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Estas operações configuram os grupos de acesso do sistema:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                "Inicializar Grupo Administrador" cria o grupo ADMINISTRADOR no sistema se ele não
                existir.
              </li>
              <li>
                "Tornar-me Administrador" associa seu usuário ao grupo ADMINISTRADOR, dando acesso a
                áreas restritas.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
