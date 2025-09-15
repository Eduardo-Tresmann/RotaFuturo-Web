import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  ariaLabel?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, className = "", ariaLabel }) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(opt => opt.value === value);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative w-full ${className}`}> 
      <button
        type="button"
        aria-label={ariaLabel}
        className="flex items-center justify-between w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected ? selected.label : "Selecione"}</span>
        <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-fade-in">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 transition ${value === opt.value ? "font-bold text-blue-600" : "text-zinc-700"}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {value === opt.value && <Check className="w-4 h-4 mr-2 text-blue-600" />} {opt.label}
            </button>
          ))}
        </div>
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
};
