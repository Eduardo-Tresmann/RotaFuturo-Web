import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FormLabel } from "./form-label";

interface FileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  onlyImages?: boolean;
}

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  ({ className, error: errorProp, label, required, accept, multiple, onlyImages, ...props }, ref) => {
    const [error, setError] = React.useState<string | undefined>(errorProp);

    const [fileInfo, setFileInfo] = React.useState<{ name: string; size: number } | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sempre tenta mostrar o arquivo selecionado, mesmo após submit/re-render
    const getCurrentFileInfo = () => {
      if (fileInfo) return fileInfo;
      const input = inputRef.current;
      if (input && input.files && input.files.length > 0) {
        const file = input.files[0];
        return { name: file.name, size: file.size };
      }
      return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(undefined);
      if (onlyImages && e.target.files && e.target.files.length > 0) {
        const isValid = Array.from(e.target.files).every(file => file.type.startsWith('image/'));
        if (!isValid) {
          setError('Selecione apenas arquivos de imagem.');
          e.target.value = '';
          setFileInfo(null);
          return;
        }
      }
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFileInfo({ name: file.name, size: file.size });
      }
      if (e.target.files && e.target.files.length === 0) {
        setFileInfo(null);
      }
      if (props.onChange) props.onChange(e);
    };

    function formatSize(size: number) {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel htmlFor={props.id} required={required} className="text-zinc-700 dark:text-zinc-300">
            {label}
          </FormLabel>
        )}
        <input
          ref={ref}
          type="file"
          className={cn(
            "block w-full text-sm text-zinc-800 dark:text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {getCurrentFileInfo() && (
          <span className="ml-3 text-xs text-zinc-400">
            {getCurrentFileInfo()?.name} ({formatSize(getCurrentFileInfo()?.size ?? 0)})
          </span>
        )}
      </div>
    );
  }
);

FileField.displayName = "FileField";