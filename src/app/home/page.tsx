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
import { usePessoa } from '@/hooks/usePessoa';
import { ProfileFormStepper } from './components/ProfileFormStepper';
import { useAuthContext } from '@/components/context/AuthContext';

export default function PaginaHome() {
  const { authResolved } = useAuthContext();
  const router = useRouter();
  const { pessoa, loading } = usePessoa();
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Boas-vindas', 'Informações', 'Perfil'];

  if (!authResolved) return <div>Carregando...</div>;

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
          {/* Conteúdo de cada passo */}
          {currentStep === 0 && (
            <div className="text-center">
              <p className="mb-6 text-lg">Bem-vindo! Siga os passos para completar seu cadastro.</p>
              <button
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setCurrentStep(1)}
              >
                Próximo
              </button>
            </div>
          )}
          {currentStep === 1 && (
            <div className="text-center">
              <p className="mb-6 text-lg">Passo 2: (Conteúdo futuro)</p>
              <button
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setCurrentStep(2)}
              >
                Próximo
              </button>
            </div>
          )}
          {currentStep === 2 && <ProfileFormStepper onFinish={() => setShowStepper(false)} />}
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
