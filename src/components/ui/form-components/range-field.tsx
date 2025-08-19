import { cn } from "@/lib/utils";
import { FormLabel } from "./form-label";
import { forwardRef } from "react";

interface RangeFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export const RangeField = forwardRef<HTMLInputElement, RangeFieldProps>(
  ({ className, error, label, required, min = 0, max = 100, step = 1, showValue = true, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            className={cn(
              "flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer",
              error && "bg-red-200",
              className
            )}
            ref={ref}
            {...props}
          />
          {showValue && (
            <span className="text-sm text-zinc-600 min-w-[3rem] text-center font-medium">
              {props.value || min}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

RangeField.displayName = "RangeField";