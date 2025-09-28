'use client';

import { HeaderHome } from '@/components/HeaderHome';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stepper from '@/components/Stepper';
import { Button } from '@/components/ui/button';
import { usePessoa } from '@/hooks/usePessoa';
import { ProfileFormStepper } from './components/ProfileFormStepper';
import { VocationalTestStepper } from '@/components/VocationalTestStepper';
import { VocationalTestResultStepper } from './components/VocationalTestResultStepper';
import { SubareaTestStepper } from '@/components/SubareaTestStepper';
import { SubareaTestResultStepper } from './components/SubareaTestResultStepper';
import { ManualSelectionStepper } from './components/ManualSelectionStepper';
import configService from '@/services/configService';
import { useAuthContext } from '@/components/context/AuthContext';

export default function PaginaHome() {
  const { authResolved, usuario } = useAuthContext();
  const router = useRouter();
  const { pessoa, loading } = usePessoa();
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // Armazena o passo mais avançado que o usuário já visitou
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [config, setConfig] = useState({
    testeVocacionalId: 2,
    testeSubareaId: 3,
  });
  const [subareaTesteId, setSubareaTesteId] = useState<number | null>(null);
  const steps = ['Teste', 'Áreas', 'Especialidade', 'Cursos', 'Confirmar', 'Perfil'];

  // Exibe o stepper em fullpage se não houver pessoa vinculada
  useEffect(() => {
    if (!loading && !pessoa) {
      setShowStepper(true);
    }
  }, [loading, pessoa]);

  // Carrega as configurações da aplicação
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const appConfig = await configService.getConfig();
        setConfig(appConfig);
        console.log('Configurações carregadas:', appConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    loadConfig();
  }, []);

  // Função para navegar para um passo específico
  const navigateToStep = (step: number) => {
    if (step <= maxVisitedStep) {
      setCurrentStep(step);
    }
  };

  // Função para avançar para o próximo passo
  const goToNextStep = (step: number) => {
    setCurrentStep(step);
    // Atualiza o passo máximo visitado, se necessário
    if (step > maxVisitedStep) {
      setMaxVisitedStep(step);
    }
  };

  const renderContent = () => {
    if (showStepper) {
      return (
        <Stepper
          steps={steps}
          currentStep={currentStep}
          maxVisitedStep={maxVisitedStep}
          onStepClick={navigateToStep}
          fullpage
        >
          {/* Passo 1 - Teste Vocacional */}
          {currentStep === 0 && config.testeVocacionalId && (
            <VocationalTestStepper
              testeId={config.testeVocacionalId} // ID do teste vocacional das configurações
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              onFinish={() => goToNextStep(1)}
            />
          )}
          {currentStep === 0 && !config.testeVocacionalId && (
            <div className="w-full flex flex-col flex-1 max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 min-h-[400px] justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Teste não disponível</h2>
                <p className="mb-4">O teste vocacional não está configurado no sistema.</p>
                <p>Por favor, entre em contato com o administrador.</p>
              </div>
            </div>
          )}
          {/* Passo 2 - Resultado do Teste Vocacional */}
          {currentStep === 1 && config.testeVocacionalId && (
            <VocationalTestResultStepper
              testeId={config.testeVocacionalId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              onBack={() => navigateToStep(0)}
              onNext={async (areaId) => {
                setSelectedAreaId(areaId);

                // Busca o teste de subárea específico para a área selecionada
                try {
                  const subareaConfig = await configService.getTesteSubareaByArea(areaId);
                  setSubareaTesteId(subareaConfig.testeSubareaId);
                  console.log(
                    'Teste de subárea para área',
                    areaId,
                    ':',
                    subareaConfig.testeSubareaId,
                  );
                } catch (error) {
                  console.error('Erro ao buscar teste de subárea:', error);
                  // Em caso de erro, usa o ID padrão da configuração geral
                  setSubareaTesteId(config.testeSubareaId);
                }

                goToNextStep(2);
              }}
            />
          )}
          {/* Passo 3 - Teste de Especialidade/Subárea */}
          {currentStep === 2 && selectedAreaId && subareaTesteId && (
            <SubareaTestStepper
              testeId={subareaTesteId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              areaId={selectedAreaId}
              onFinish={() => goToNextStep(3)}
            />
          )}
          {currentStep === 2 && !subareaTesteId && (
            <div className="w-full flex flex-col flex-1 max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 min-h-[400px] justify-between">
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Teste não disponível</h2>
                <p className="mb-4">O teste de especialidade não está configurado no sistema.</p>
                <p className="mb-8">Por favor, entre em contato com o administrador.</p>

                <button
                  onClick={() => navigateToStep(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Voltar para resultados
                </button>
              </div>
            </div>
          )}
          {/* Passo 4 - Resultado do Teste de Especialidade/Subárea */}
          {currentStep === 3 && selectedAreaId && subareaTesteId && (
            <SubareaTestResultStepper
              testeId={subareaTesteId}
              usuarioId={usuario?.usuId ?? 0} // Usar ID do usuário autenticado, não da pessoa
              areaId={selectedAreaId}
              onBack={() => navigateToStep(2)}
              onNext={() => goToNextStep(4)}
            />
          )}
          {/* Passo 5 - Seleção Manual de Área/Subárea */}
          {currentStep === 4 && (
            <ManualSelectionStepper
              usuarioId={usuario?.usuId ?? 0}
              preselectedAreaId={selectedAreaId || undefined}
              onBack={() => navigateToStep(3)}
              onNext={() => goToNextStep(5)}
            />
          )}

          {/* Passo 6 - Perfil */}
          {currentStep === 5 && (
            <ProfileFormStepper
              onFinish={() => setShowStepper(false)}
              onBack={() => setCurrentStep(5)}
            />
          )}
        </Stepper>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center text-xl font-semibold text-zinc-900">
            Página home, em desenvolvimento
          </div>
        </div>
      </div>
    );
  };

  // Exibir um indicador de progresso na barra superior se estiver no stepper
  const renderProgressIndicator = () => {
    if (!showStepper) return null;

    const totalSteps = steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      {/* Barra de progresso quando o stepper está ativo */}
      {renderProgressIndicator()}

      {/* Só mostramos o cabeçalho quando não estiver no stepper fullpage */}
      {!showStepper && (
        <HeaderHome
          extra={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />
      )}

      {/* Conteúdo principal (stepper ou conteúdo regular) */}
      {renderContent()}
    </ProtectedRoute>
  );
}
