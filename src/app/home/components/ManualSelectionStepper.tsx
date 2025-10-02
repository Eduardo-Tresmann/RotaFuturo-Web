'use client';
import React, { useEffect, useState } from 'react';
import { Area } from '@/types/area';
import { AreaSub } from '@/types/areasub';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { usuarioAreaService } from '@/services/usuarioarea/UsuarioAreaService';
import { Button } from '@/components/ui/button';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { ChevronLeft, GraduationCap, CheckCircle2 } from 'lucide-react';
import AreaSelectionAccordion from './AreaSelectionAccordion';
import { stateService } from '@/services/stateService';
interface ManualSelectionStepperProps {
  usuarioId: number;
  onBack: () => void;
  onNext: () => void;
  preselectedAreaId?: number;
}
interface UserAreaSelection {
  areaId: number;
  subareaId?: number;
}
export const ManualSelectionStepper: React.FC<ManualSelectionStepperProps> = ({
  usuarioId,
  onBack,
  onNext,
  preselectedAreaId,
}) => {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [subareas, setSubareas] = useState<AreaSub[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(preselectedAreaId || null);
  const [selectedSubareaId, setSelectedSubareaId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingSelection, setExistingSelection] = useState<UserAreaSelection | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allAreas = await areaService.listAll();
        setAreas(allAreas);
        const allSubareas = await areaSubService.listAll();
        setSubareas(allSubareas);
        if (preselectedAreaId) {
          setExistingSelection({
            areaId: preselectedAreaId,
          });
          setSelectedAreaId(preselectedAreaId);
        }
      } catch (error) {
        console.error('Erro ao carregar áreas e subáreas:', error);
        FormNotification.error({
          message: 'Não foi possível carregar as áreas e subáreas disponíveis.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [preselectedAreaId]);
  const handleSelectArea = (areaId: number) => {
    setSelectedAreaId(areaId);
    setSelectedSubareaId(null);
  };
  const handleSelectSubarea = (subareaId: number) => {
    setSelectedSubareaId(subareaId);
  };
  const handleSkip = () => {
    FormNotification.info({
      message: 'Você optou por manter a escolha feita pelo teste automático.',
    });
    onNext();
  };
  const handleSavePreference = async () => {
    if (!selectedAreaId || !selectedSubareaId) {
      FormNotification.warning({ message: 'Selecione uma área e uma subárea para continuar.' });
      return;
    }
    try {
      setSubmitting(true);
      await usuarioAreaService.vincularUsuarioArea(usuarioId, selectedAreaId);
      stateService.set(`selected_subarea_${usuarioId}`, {
        subareaId: selectedSubareaId,
        areaId: selectedAreaId,
      });
      FormNotification.success({ message: 'Especialidade selecionada com sucesso!' });
      onNext();
    } catch (error) {
      FormNotification.error({ message: 'Erro ao salvar especialidade' });
      console.error('Erro ao salvar preferência:', error);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="w-full flex flex-col min-h-[50vh] sm:min-h-[60vh]">
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-24 w-24 sm:h-32 sm:w-32 bg-blue-200 dark:bg-blue-800/50 rounded-full mb-3 sm:mb-4 flex items-center justify-center">
              <GraduationCap size={48} className="text-blue-400 dark:text-blue-500" />
            </div>
            <div className="h-5 sm:h-6 bg-blue-200 dark:bg-blue-800/50 rounded w-48 sm:w-64 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-blue-100 dark:bg-blue-900/50 rounded w-36 sm:w-48"></div>
            <p className="mt-6 sm:mt-8 text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">
              Carregando opções...
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      {}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 py-4 sm:py-6 md:py-8 px-3 sm:px-4 rounded-t-xl text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 rounded-full w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
            Escolha Manual de Especialidade
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm px-2">
            Selecione a área e especialidade que mais combina com seus interesses.
          </p>
        </div>
      </div>
      {}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-b-xl shadow-sm">
        {existingSelection && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
              <p className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base">
                Seleção automática detectada
              </p>
            </div>
            <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              O teste automático já selecionou uma área para você. Você pode manter essa escolha ou
              selecionar outra manualmente.
            </p>
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm space-y-1">
              <p className="break-words dark:text-gray-300">
                <span className="font-medium">Área:</span>{' '}
                {areas.find((a) => a.areaId === existingSelection.areaId)?.areaDescricao ||
                  'Não disponível'}
              </p>
              {existingSelection.subareaId && (
                <p className="break-words dark:text-gray-300">
                  <span className="font-medium">Subárea:</span>{' '}
                  {subareas.find((s) => s.areasId === existingSelection.subareaId)
                    ?.areasDescricao || 'Não disponível'}
                </p>
              )}
            </div>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center text-xs sm:text-sm">
          Explore as diferentes áreas disponíveis e escolha a que mais se alinha com seus objetivos.
        </p>
        <div className="mt-4">
          <AreaSelectionAccordion
            areas={areas}
            subareas={subareas}
            onSelectArea={handleSelectArea}
            onSelectSubarea={handleSelectSubarea}
            selectedAreaId={selectedAreaId || undefined}
            selectedSubareaId={selectedSubareaId || undefined}
          />
        </div>
        {}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          {}
          <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
            {}
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={onBack}
              disabled={submitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            {}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {}
              {existingSelection && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={submitting}
                  className="text-gray-600 dark:text-gray-400 text-sm sm:text-base w-full sm:w-auto"
                  size="sm"
                >
                  Manter escolha automática
                </Button>
              )}
              {}
              <Button
                onClick={handleSavePreference}
                disabled={submitting || !selectedAreaId || !selectedSubareaId}
                className="bg-blue-600 text-white font-semibold hover:bg-blue-700 w-full sm:w-auto"
              >
                {submitting ? 'Salvando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManualSelectionStepper;
