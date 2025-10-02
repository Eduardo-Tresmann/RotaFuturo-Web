import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormLabel } from './form-label';
import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: React.ReactNode;
  required?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
}
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      error,
      label,
      required,
      icon: Icon,
      iconColor = 'text-zinc-400 dark:text-zinc-500',
      ...props
    },
    ref,
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
                iconColor,
              )}
            />
          )}
          <Input
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
TextField.displayName = 'TextField';
