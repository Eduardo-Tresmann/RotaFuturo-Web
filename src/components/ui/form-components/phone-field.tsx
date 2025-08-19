import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { FormLabel } from './form-label';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PhoneFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      className,
      error,
      label,
      required,
      icon: Icon,
      iconColor = 'text-zinc-400',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10',
                iconColor
              )}
            />
          )}
          <Input
            type="tel"
            placeholder="(11) 99999-9999"
            className={cn(
              Icon && 'pl-10',
              error &&
                'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PhoneField.displayName = 'PhoneField';
