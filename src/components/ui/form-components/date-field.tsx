import * as React from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { CalendarDropdown } from './calendar-dropdown';
import 'react-day-picker/dist/style.css';
interface DateFieldProps {
  label?: string;
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
  name?: string;
  className?: string;
}
export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  required,
  name,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  let selected: Date | undefined = undefined;
  if (value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      selected = new Date(value + 'T00:00:00');
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      selected = parse(value, 'dd/MM/yyyy', new Date());
    }
  }
  const [inputValue, setInputValue] = React.useState(
    selected ? format(selected, 'dd/MM/yyyy') : '',
  );
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-gray-800 dark:text-gray-200 font-medium text-sm mb-1 block">
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
                'flex h-10 w-full items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:border-green-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'
              }
              value={inputValue}
              onChange={(e) => {
                let val = e.target.value;
                const nums = val.replace(/[^0-9]/g, '');
                if (nums.length === 8) {
                  val = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
                  setInputValue(val);
                } else if (nums.length > 8) {
                  val = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
                  setInputValue(val);
                } else {
                  if (nums.length > 2 && nums.length <= 4) {
                    val = `${nums.slice(0, 2)}/${nums.slice(2)}`;
                  } else if (nums.length > 4) {
                    val = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
                  }
                  setInputValue(val);
                }
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                  try {
                    const parsed = parse(val, 'dd/MM/yyyy', new Date());
                    if (!isNaN(parsed.getTime())) {
                      // Formatação manual para evitar problemas de compatibilidade
                      const year = parsed.getFullYear();
                      const month = parsed.getMonth() + 1;
                      const day = parsed.getDate();
                      const mm = month < 10 ? `0${month}` : `${month}`;
                      const dd = day < 10 ? `0${day}` : `${day}`;
                      onChange(`${year}-${mm}-${dd}`);
                    } else {
                      onChange(null);
                    }
                  } catch (error) {
                    onChange(null);
                  }
                } else {
                  onChange(null);
                }
              }}
              onBlur={(e) => {
                const nums = e.target.value.replace(/[^0-9]/g, '');
                if (nums.length === 8) {
                  const formattedVal = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(
                    4,
                    8,
                  )}`;
                  setInputValue(formattedVal);
                  // Tentamos fazer o parsing da data
                  try {
                    const parsed = parse(formattedVal, 'dd/MM/yyyy', new Date());
                    if (!isNaN(parsed.getTime())) {
                      // Formatação manual para evitar problemas de compatibilidade
                      const year = parsed.getFullYear();
                      const month = parsed.getMonth() + 1;
                      const day = parsed.getDate();
                      const mm = month < 10 ? `0${month}` : `${month}`;
                      const dd = day < 10 ? `0${day}` : `${day}`;
                      onChange(`${year}-${mm}-${dd}`);
                      return;
                    }
                  } catch (error) {
                    onChange(null);
                  }
                }
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(e.target.value)) {
                  setInputValue('');
                  onChange(null);
                }
              }}
              name={name}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-green-500 dark:text-green-300" />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="min-w-[280px] max-w-[320px] p-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-[99999] animate-datepicker-fade-slide"
          style={{ zIndex: 99999 }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              setOpen(false);
              if (date) {
                const yyyy = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                // Formatar com zeros à esquerda sem usar padStart
                const mm = month < 10 ? `0${month}` : `${month}`;
                const dd = day < 10 ? `0${day}` : `${day}`;
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
              selected: 'bg-green-500 text-white dark:bg-green-600 font-bold',
              today: 'border border-green-500 dark:border-green-400',
            }}
            className="p-1 text-sm"
            style={{ fontSize: '0.92rem' }}
            components={{
              Dropdown: (props) => {
                const options = (props.options ?? []).map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }));
                const handleChange = (val: string | number) => {
                  if (props.onChange) {
                    const event = {
                      target: { value: val },
                    } as React.ChangeEvent<HTMLSelectElement>;
                    props.onChange(event);
                  }
                };
                return (
                  <CalendarDropdown
                    options={options}
                    value={Array.isArray(props.value) ? props.value[0] ?? '' : props.value ?? ''}
                    onChange={handleChange}
                    ariaLabel={props['aria-label']}
                  />
                );
              },
            }}
          />
        </PopoverContent>
        {/* Estilos globais para o calendário */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
            animation: datepicker-fade-slide 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .dark .rdp-day {
            color: #e4e4e7;
          }
          .dark .rdp-day_disabled {
            color: #52525b;
          }
          .dark .rdp-button:hover:not([disabled]) {
            background-color: #3f3f46;
          }
          .dark .rdp-caption_label {
            color: #e4e4e7;
          }
          .dark .rdp-head_cell {
            color: #a1a1aa;
          }
        `,
          }}
        />
      </Popover>
    </div>
  );
};
