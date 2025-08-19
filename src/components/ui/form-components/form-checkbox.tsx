import { cn } from "@/lib/utils";
import { FormLabel } from "./form-label";

interface FormCheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function FormCheckbox({ 
  id, 
  checked, 
  onChange, 
  error, 
  label, 
  required, 
  className 
}: FormCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary",
          error && "border-red-500",
          className
        )}
      />
      {label && (
        <FormLabel htmlFor={id} required={required} className="mb-0">
          {label}
        </FormLabel>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}