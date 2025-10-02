import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormLabel } from './form-label';
import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
interface MoneyFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label?: string;
  required?: boolean;
  currency?: string;
  icon?: LucideIcon;
  iconColor?: string;
}
export const MoneyField = forwardRef<HTMLInputElement, MoneyFieldProps>(
  (
    {
      className,
      error,
      label,
      required,
      currency = 'R$',
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
          <span
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-zinc-400 font-medium',
              Icon ? 'left-10' : 'left-4'
            )}
          >
            {currency}
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            className={cn(
              Icon ? 'pl-16' : 'pl-12',
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
MoneyField.displayName = 'MoneyField';
