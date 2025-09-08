
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
          <FormLabel htmlFor={props.id} required={required}>
            {label}
          </FormLabel>
        )}
        <label className="block cursor-pointer group">
          <div className={cn(
            "flex items-center h-12 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 text-zinc-600 transition-all duration-150 shadow-sm hover:border-blue-500 hover:shadow-lg focus-within:border-blue-600 focus-within:shadow-lg",
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}>
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3.5 3.5M12 8l3.5 3.5M21 16.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.5a2 2 0 01.59-1.42l7-7a2 2 0 012.82 0l7 7A2 2 0 0121 16.5z" /></svg>
            {label && <span className="text-sm text-zinc-900 font-bold">{label}</span>}
            {getCurrentFileInfo() ? (
              <span className="ml-3 text-xs text-blue-700 font-semibold">{getCurrentFileInfo()?.name} <span className="text-zinc-400">({formatSize(getCurrentFileInfo()?.size ?? 0)})</span></span>
            ) : (
              <span className="ml-3 text-xs text-zinc-400 font-normal">Clique para selecionar uma imagem</span>
            )}
          </div>
          <input
            type="file"
            accept={onlyImages ? 'image/*' : accept}
            multiple={multiple}
            className="sr-only"
            ref={el => {
              if (typeof ref === 'function') ref(el);
              // @ts-ignore
              inputRef.current = el;
            }}
            onChange={handleChange}
            {...props}
          />
        </label>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FileField.displayName = "FileField";