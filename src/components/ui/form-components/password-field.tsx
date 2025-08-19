import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormLabel } from './form-label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
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
    const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? 'text' : 'password'}
            className={cn(
              Icon && 'pl-10',
              'pr-10',
              error &&
                'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent z-20"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-zinc-400" />
            ) : (
              <Eye className="h-4 w-4 text-zinc-400" />
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
