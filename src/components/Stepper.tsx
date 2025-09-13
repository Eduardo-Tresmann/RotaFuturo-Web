import React from 'react';

interface StepperProps {
  steps: string[]; // Array de títulos dos passos
  currentStep: number; // Índice do passo atual (0-based)
  fullpage?: boolean;
  children?: React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, fullpage = false, children }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
      <div className="flex items-center justify-center gap-0 my-8 w-full max-w-2xl">
        {steps.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 min-w-0">
            <div className="relative flex flex-col items-center">
              <div
                className={`shadow-lg transition-all duration-300 flex items-center justify-center border-4 w-14 h-14 text-lg font-bold z-10
                  ${
                    idx === currentStep
                      ? 'bg-blue-600 border-blue-400 text-white scale-110'
                      : idx < currentStep
                      ? 'bg-blue-100 border-blue-400 text-blue-700'
                      : 'bg-gray-200 border-gray-300 text-gray-400'
                  }
                `}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-3 text-base font-semibold text-center max-w-[7rem] truncate
                ${idx === currentStep ? 'text-blue-700' : 'text-gray-500'}`}
              >
                {label}
              </span>
              {/* Linha de conexão */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 left-full w-full h-1 flex items-center">
                  <div
                    className={`h-1 w-full rounded transition-all duration-300
                    ${idx < currentStep ? 'bg-blue-400' : 'bg-gray-300'}`}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );

  if (!fullpage) return content;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white w-screen h-screen">
      {content}
    </div>
  );
};

export default Stepper;
