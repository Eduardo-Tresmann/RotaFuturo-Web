import React, { useState, useEffect } from 'react';
import { FormLabel } from './form-label';
import { Search } from 'lucide-react';

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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          id={name}
          name={name}
          type="text"
          className="w-full border rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-zinc-800 placeholder:text-zinc-400"
          value={inputValue ?? ''}
          onChange={(e) => {
            setInputValue(e.target.value ?? '');
            setShowOptions(true);
          }}
          autoComplete="off"
          required={required}
          placeholder="Buscar..."
        />
      </div>
      {showOptions && options.length > 0 && (
        <ul className="absolute z-20 bg-white border-t border-l border-r border-zinc-200 rounded-xl shadow-lg w-full mt-2 max-h-56 overflow-auto animate-fade-in" style={{borderBottom: 'none'}}>
          {options.map((opt, idx) => (
            <li
              key={String(opt.value) + '-' + idx}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors text-zinc-800 text-base"
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
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
