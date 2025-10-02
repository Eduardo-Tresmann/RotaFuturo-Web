import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
interface PhoneFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  label?: React.ReactNode; 
}
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      className,
      error,
      required,
      icon: Icon,
      iconColor = 'text-zinc-400 dark:text-zinc-500',
      label,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-100 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10',
                iconColor,
              )}
            />
          )}
          <Input
            type="tel"
            placeholder="(11) 99999-9999"
            className={cn(
              Icon && 'pl-10',
              error && 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500',
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
PhoneField.displayName = 'PhoneField';
