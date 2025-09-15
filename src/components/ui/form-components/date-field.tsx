import * as React from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { CalendarDropdown } from "./calendar-dropdown";
import "react-day-picker/dist/style.css";

interface DateFieldProps {
  label?: string;
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
  name?: string;
  className?: string; // Adicionado
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  required,
  name,
  className, // Adicionado
}) => {
  const [open, setOpen] = React.useState(false);
  // Aceita tanto yyyy-MM-dd quanto dd/MM/yyyy
  let selected: Date | undefined = undefined;
  if (value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      // yyyy-MM-dd
      selected = new Date(value + 'T00:00:00');
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      // dd/MM/yyyy
      selected = parse(value, 'dd/MM/yyyy', new Date());
    }
  }
  const [inputValue, setInputValue] = React.useState(selected ? format(selected, 'dd/MM/yyyy') : '');

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-zinc-700 dark:text-zinc-300 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{2}/\d{2}/\d{4}"
              placeholder="dd/mm/aaaa"
              className={
                className ||
                "flex h-12 w-full items-center rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-neutral-900 pl-10 pr-3 py-3 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow"
              }
              value={inputValue}
              onChange={e => {
                const val = e.target.value;
                setInputValue(val);
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                  const parsed = parse(val, 'dd/MM/yyyy', new Date());
                  if (!isNaN(parsed.getTime())) {
                    // Salva no formato yyyy-MM-dd
                    onChange(format(parsed, 'yyyy-MM-dd'));
                  } else {
                    onChange(null);
                  }
                } else {
                  onChange(null);
                }
              }}
              onBlur={e => {
                // Se não for válido, limpa
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(e.target.value)) {
                  setInputValue('');
                  onChange(null);
                }
              }}
              name={name}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-purple-500 dark:text-purple-300" />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="min-w-[240px] max-w-[320px] p-0 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-zinc-200 dark:border-neutral-700 z-[9999] animate-datepicker-fade-slide"
          style={{ zIndex: 9999 }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={date => {
              setOpen(false);
              if (date) {
                // Corrige para salvar no formato yyyy-MM-dd local
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                setInputValue(`${dd}/${mm}/${yyyy}`);
                onChange(`${yyyy}-${mm}-${dd}`);
              } else {
                setInputValue('');
                onChange(null);
              }
            }}
            locale={ptBR}
            captionLayout="dropdown"
            fromYear={1950}
            toYear={new Date().getFullYear()}
            modifiersClassNames={{
              selected: "bg-blue-500 text-white",
              today: "border border-blue-500",
            }}
            className="p-1 text-sm"
            style={{ fontSize: '0.92rem' }}
            components={{
              Dropdown: (props) => {
                // Defensive: handle possible undefineds from react-day-picker types
                const options = (props.options ?? []).map(opt => ({ value: opt.value, label: opt.label }));
                // react-day-picker passes onChange as (e: React.ChangeEvent<HTMLSelectElement>), but CalendarDropdown expects (value: string | number)
                const handleChange = (val: string | number) => {
                  if (props.onChange) {
                    // Simulate a change event for react-day-picker
                    const event = { target: { value: val } } as React.ChangeEvent<HTMLSelectElement>;
                    props.onChange(event);
                  }
                };
                return (
                  <CalendarDropdown
                    options={options}
                    value={
                      Array.isArray(props.value)
                        ? (props.value[0] ?? '')
                        : (props.value ?? '')
                    }
                    onChange={handleChange}
                    ariaLabel={props['aria-label']}
                  />
                );
              }
            }}
          />
        </PopoverContent>
      <style jsx global>{`
        @keyframes datepicker-fade-slide {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-datepicker-fade-slide {
          animation: datepicker-fade-slide 0.22s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
      </Popover>
    </div>
  );
};
