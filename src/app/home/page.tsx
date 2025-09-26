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
import { useAuthContext } from '@/components/context/AuthContext';

export default function PaginaHome() {
  const { authResolved } = useAuthContext();
  const router = useRouter();
  const { pessoa, loading } = usePessoa();
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Teste Vocacional', 'Informações', 'Perfil'];

  // Exibe o stepper em fullpage se não houver pessoa vinculada
  useEffect(() => {
    if (!loading && !pessoa) {
      setShowStepper(true);
    }
  }, [loading, pessoa]);

  const renderContent = () => {
    if (showStepper) {
      return (
        <Stepper steps={steps} currentStep={currentStep} fullpage>
          {/* Passo 1 - Teste Vocacional */}
          {currentStep === 0 && (
            <VocationalTestStepper
              testeId={1} // ID do teste vocacional, pode ser dinâmico
              usuarioId={pessoa?.usuId ?? 0} // Ajuste conforme contexto de usuário
              onFinish={() => setCurrentStep(1)}
            />
          )}
          {/* Passo 2 */}
          {currentStep === 1 && (
            <div className="w-full flex flex-col flex-1 max-w-2xl mx-auto bg-white/90 p-10 border-t border-x border-zinc-100 h-[80vh] min-h-[400px] justify-between">
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="mb-6 text-lg">Passo 2: (Conteúdo futuro)</p>
              </div>
              <div className="flex justify-center gap-4 mt-8 w-full">
                <Button
                  className="w-36 px-8 py-3 font-bold text-base bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setCurrentStep(0)}
                  type="button"
                  variant="secondary"
                >
                  Voltar
                </Button>
                <Button
                  className="w-36 px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition text-base"
                  onClick={() => setCurrentStep(2)}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
          {/* Passo 3 */}
          {currentStep === 2 && (
            <ProfileFormStepper
              onFinish={() => setShowStepper(false)}
              onBack={() => setCurrentStep(1)}
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

  return (
    <ProtectedRoute>
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
      {renderContent()}
    </ProtectedRoute>
  );
}
