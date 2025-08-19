import { cn } from "@/lib/utils";
import { FormLabel } from "./form-label";
import { forwardRef } from "react";

interface FileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  ({ className, error, label, required, accept, multiple, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow",
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

FileField.displayName = "FileField";