import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';

interface Option {
  value: string | number;
  label: string;
}

interface AutoCompleteFieldProps {
  name: string;
  label: React.ReactNode;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  fetchOptions: (query: string) => Promise<Option[]>;
  required?: boolean;
}

export function AutoCompleteField({
  name,
  label,
  value,
  onChange,
  fetchOptions,
  required,
}: AutoCompleteFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  // Sempre que o value mudar, sincroniza o inputValue com o label correspondente,
  // buscando a opção se necessário
  useEffect(() => {
    async function syncInputValue() {
      if (value !== undefined && value !== null) {
        let selected = options.find(opt => String(opt.value) === String(value));
        if (!selected && typeof fetchOptions === 'function') {
          const fetched = await fetchOptions('');
          const found = fetched.find(opt => String(opt.value) === String(value));
          if (found) {
            const filtered = options.filter(opt => String(opt.value) !== String(found.value));
            setOptions([found, ...filtered]);
            selected = found;
          }
        }
        if (selected && inputValue !== selected.label) {
          setInputValue(selected.label);
        }
      }
    }
    syncInputValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const safeValue = typeof inputValue === 'string' ? inputValue : String(inputValue ?? '');
    if (safeValue.length > 0) {
      fetchOptions(safeValue).then(setOptions);
    } else {
      setOptions([]);
    }
  }, [inputValue, fetchOptions]);

  return (
    <div className="w-full space-y-2 relative">
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      <input
        id={name}
        name={name}
        type="text"
        className="w-full border rounded px-3 py-2"
        value={inputValue ?? ''}
        onChange={(e) => {
          setInputValue(e.target.value ?? '');
          setShowOptions(true);
        }}
        autoComplete="off"
        required={required}
      />
      {showOptions && options.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-auto">
          {options.map((opt, idx) => (
            <li
              key={String(opt.value) + '-' + idx}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => {
                setInputValue(opt.label);
                onChange(Number(opt.value));
                setShowOptions(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
