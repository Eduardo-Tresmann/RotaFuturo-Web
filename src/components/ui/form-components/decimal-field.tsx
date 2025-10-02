import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormLabel } from "./form-label";
import { forwardRef } from "react";
interface DecimalFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}
export const DecimalField = forwardRef<HTMLInputElement, DecimalFieldProps>(
  ({ className, error, label, required, min, max, step = 0.01, precision = 2, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
DecimalField.displayName = "DecimalField";