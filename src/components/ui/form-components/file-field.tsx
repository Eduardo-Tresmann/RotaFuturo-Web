import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FormLabel } from './form-label';
import { ImageIcon, Upload } from 'lucide-react';

interface FileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  onlyImages?: boolean;
  iconColor?: string;
}

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  (
    {
      className,
      error: errorProp,
      label,
      required,
      accept,
      multiple,
      onlyImages,
      iconColor = 'text-blue-500',
      ...props
    },
    ref,
  ) => {
    const [error, setError] = useState<string | undefined>(errorProp);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(undefined);

      if (onlyImages && e.target.files && e.target.files.length > 0) {
        const isValid = Array.from(e.target.files).every((file) => file.type.startsWith('image/'));
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
      } else {
        setFileInfo(null);
      }

      if (props.onChange) props.onChange(e);
    };

    function formatSize(size: number) {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }

    const isImage = accept?.includes('image');

    return (
      <div className="w-full space-y-2">
        {label && (
          <FormLabel
            htmlFor={props.id}
            required={required}
            className="text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </FormLabel>
        )}

        <div className="flex items-center relative bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {isImage ? (
              <ImageIcon className={`w-5 h-5 ${iconColor}`} />
            ) : (
              <Upload className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>

          <input
            ref={ref || inputRef}
            id={props.id}
            type="file"
            className={cn(
              'block w-full text-sm text-zinc-800 dark:text-zinc-100 cursor-pointer pl-10 pr-4 py-2',
              'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0',
              'file:text-sm file:font-semibold',
              'file:bg-blue-50 dark:file:bg-blue-950/30',
              'file:text-blue-700 dark:file:text-blue-300',
              'hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30',
              'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
              className,
            )}
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
            {...props}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {fileInfo && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {fileInfo.name} ({formatSize(fileInfo.size)})
            </span>
          </div>
        )}
      </div>
    );
  },
);

FileField.displayName = 'FileField';
