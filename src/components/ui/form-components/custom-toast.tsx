import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Toast personalizado com estilos do projeto
export const CustomToast = {
  // Toast de sucesso
  success: (message: string, options?: any) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      className: 'bg-green-50 border-green-200 text-green-800 shadow-soft',
      style: {
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },

  // Toast de erro
  error: (message: string, options?: any) => {
    return toast.error(message, {
      duration: 6000,
      position: 'top-right',
      className: 'bg-red-50 border-red-200 text-red-800 shadow-soft',
      style: {
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },

  // Toast de aviso
  warning: (message: string, options?: any) => {
    return toast.warning(message, {
      duration: 5000,
      position: 'top-right',
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-soft',
      style: {
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: '1px solid #fed7aa',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },

  // Toast de informação
  info: (message: string, options?: any) => {
    return toast.info(message, {
      duration: 4000,
      position: 'top-right',
      className: 'bg-blue-50 border-blue-200 text-blue-800 shadow-soft',
      style: {
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },

  // Toast customizado
  custom: (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      className: 'bg-gray-50 border-gray-200 text-gray-800 shadow-soft',
      style: {
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      ...options,
    });
  },
};

// Hook para usar o toast personalizado
export const useCustomToast = () => {
  return CustomToast;
};
