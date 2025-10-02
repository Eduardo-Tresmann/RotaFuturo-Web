import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  CircleDot,
  Circle,
  PenLine,
  GraduationCap,
  ClipboardCheck,
  Layers,
  BookOpen,
  UserCircle,
} from 'lucide-react';
interface StepperProps {
  steps: string[]; 
  currentStep: number; 
  maxVisitedStep?: number; 
  onStepClick?: (step: number) => void; 
  fullpage?: boolean;
  children?: React.ReactNode;
}
const getStepIcon = (index: number, label: string) => {
  if (label.toLowerCase().includes('teste')) return <PenLine className="w-4 h-4 sm:w-5 sm:h-5" />;
  if (label.toLowerCase().includes('área')) return <Layers className="w-4 h-4 sm:w-5 sm:h-5" />;
  if (label.toLowerCase().includes('especialidade'))
    return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
  if (label.toLowerCase().includes('curso'))
    return <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />;
  if (label.toLowerCase().includes('confirmar'))
    return <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />;
  if (label.toLowerCase().includes('perfil'))
    return <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
  switch (index) {
    case 0:
      return <PenLine className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 1:
      return <Layers className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 2:
      return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 3:
      return <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 4:
      return <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 5:
      return <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    default:
      return <Circle className="w-4 h-4 sm:w-5 sm:h-5" />;
  }
};
const StepStatus = ({
  completed,
  active,
  children,
}: {
  completed: boolean;
  active: boolean;
  children: React.ReactNode;
}) => {
  if (completed) {
    return (
      <div className="rounded-full bg-blue-500 p-1 sm:p-1.5 text-white dark:bg-blue-600 shadow-md transition-all duration-300 ease-in-out">
        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    );
  }
  if (active) {
    return (
      <div className="rounded-full bg-blue-600 p-1 sm:p-1.5 text-white shadow-lg ring-4 ring-blue-200 dark:bg-blue-700 dark:ring-blue-500/30 transition-all duration-300 ease-in-out">
        {children}
      </div>
    );
  }
  return (
    <div className="rounded-full bg-gray-200 p-1 sm:p-1.5 text-gray-500 dark:bg-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out">
      {children}
    </div>
  );
};
const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  maxVisitedStep = currentStep,
  onStepClick,
  fullpage = false,
  children,
}) => {
  useEffect(() => {
    if (fullpage) {
      document.body.classList.add('stepper-fullpage');
      return () => {
        document.body.classList.remove('stepper-fullpage');
      };
    }
  }, [fullpage]);
  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && stepIndex <= maxVisitedStep) {
      onStepClick(stepIndex);
    }
  };
  const content = (
    <div className="flex flex-col items-center gap-2 sm:gap-4 md:gap-6 w-full pt-4 sm:pt-6 md:pt-8 bg-white dark:bg-zinc-900">
      {}
      <div className="w-full max-w-3xl mx-auto pb-6 px-4 sm:px-6">
        <div className="relative">
          {}
          <div className="relative flex justify-between w-full">
            {steps.map((label, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              const isVisitedStep = idx <= maxVisitedStep;
              const isClickable = isVisitedStep && !!onStepClick;
              const stepIcon = getStepIcon(idx, label);
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`relative flex flex-col items-center transition-transform duration-300 ${
                      isClickable ? 'cursor-pointer hover:scale-110' : ''
                    } ${isActive ? 'scale-105' : ''}`}
                    onClick={() => isClickable && handleStepClick(idx)}
                  >
                    <StepStatus completed={isCompleted} active={isActive}>
                      {stepIcon}
                    </StepStatus>
                    <span
                      className={`mt-2 text-[12px] bg-transparent sm:text-sm font-medium text-center w-18 sm:w-20 line-clamp-2 text-wrap ${
                        isActive
                          ? 'text-blue-700 dark:text-blue-400 font-semibold'
                          : isCompleted
                          ? 'text-blue-600 dark:text-blue-500'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {}
          <div className="relative h-4 mt-6">
            {}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            {}
            <div
              className="absolute inset-0 flex items-center justify-start"
              style={{
                width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`,
                transition: 'width 0.5s ease-in-out',
              }}
            >
              <div className="h-1 w-full bg-blue-500 dark:bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-1 sm:px-0">{children}</div>
    </div>
  );
  if (!fullpage) return content;
  const fullscreenStepper = (
    <div className="fullscreen-stepper">
      <div
        className="fixed inset-0 w-full min-h-screen flex flex-col items-center bg-white dark:bg-zinc-900 overflow-y-auto pt-4 sm:pt-6 md:pt-8 pb-20"
        style={{ isolation: 'isolate' }}
      >
        {content}
      </div>
    </div>
  );
  if (typeof window !== 'undefined') {
    return createPortal(fullscreenStepper, document.body);
  }
  return fullscreenStepper;
};
export default Stepper;
