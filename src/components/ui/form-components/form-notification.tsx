import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface FormNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: LucideIcon;
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export const FormNotification = {
  success: ({
    message,
    icon,
    duration = 4000,
    position = 'top-right',
    className,
    action,
  }: Omit<FormNotificationProps, 'type'>) => {
    const Icon = icon;
    return toast.success(message, {
      duration,
      position,
      className: cn('bg-green-50 border-green-200 text-green-800', className),
      icon: Icon ? <Icon className="h-4 w-4 text-green-600" /> : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  error: ({
    message,
    icon,
    duration = 6000,
    position = 'top-right',
    className,
    action,
  }: Omit<FormNotificationProps, 'type'>) => {
    const Icon = icon;
    return toast.error(message, {
      duration,
      position,
      className: cn('bg-red-50 border-red-200 text-red-800', className),
      icon: Icon ? <Icon className="h-4 w-4 text-red-600" /> : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  warning: ({
    message,
    icon,
    duration = 5000,
    position = 'top-right',
    className,
    action,
  }: Omit<FormNotificationProps, 'type'>) => {
    const Icon = icon;
    return toast.warning(message, {
      duration,
      position,
      className: cn(
        'bg-yellow-50 border-yellow-200 text-yellow-800',
        className
      ),
      icon: Icon ? <Icon className="h-4 w-4 text-yellow-600" /> : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  info: ({
    message,
    icon,
    duration = 4000,
    position = 'top-right',
    className,
    action,
  }: Omit<FormNotificationProps, 'type'>) => {
    const Icon = icon;
    return toast.info(message, {
      duration,
      position,
      className: cn('bg-blue-50 border-blue-200 text-blue-800', className),
      icon: Icon ? <Icon className="h-4 w-4 text-blue-600" /> : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  custom: ({
    message,
    icon,
    duration = 4000,
    position = 'top-right',
    className,
    action,
  }: Omit<FormNotificationProps, 'type'>) => {
    const Icon = icon;
    return toast(message, {
      duration,
      position,
      className: cn('bg-gray-50 border-gray-200 text-gray-800', className),
      icon: Icon ? <Icon className="h-4 w-4 text-gray-600" /> : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  dismiss: () => toast.dismiss(),
  dismissById: (id: string | number) => toast.dismiss(id),
};
export const useFormNotification = () => {
  return FormNotification;
};
export const NotificationExample = () => {
  const handleSuccess = () => {
    FormNotification.success({
      message: 'Operação realizada com sucesso!',
      icon: undefined, 
      duration: 3000,
      position: 'top-right',
    });
  };
  const handleError = () => {
    FormNotification.error({
      message: 'Ocorreu um erro na operação',
      icon: undefined,
      duration: 5000,
      position: 'top-center',
    });
  };
  return (
    <div className="space-y-2">
      <button onClick={handleSuccess}>Mostrar Sucesso</button>
      <button onClick={handleError}>Mostrar Erro</button>
    </div>
  );
};
