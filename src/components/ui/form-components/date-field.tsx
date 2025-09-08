

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateFieldProps {
  label?: string;
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
  name?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  required,
  name,
}) => {
  const [open, setOpen] = React.useState(false);
  const selected = value ? new Date(value) : undefined;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-zinc-700 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center rounded-xl border-2 border-zinc-200 bg-white px-10 py-3 text-sm ring-offset-background placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow relative"
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <CalendarIcon className="h-5 w-5 text-purple-500" />
            </span>
            {selected ? format(selected, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="min-w-[240px] max-w-[320px] p-0 bg-white rounded-xl shadow-lg border border-zinc-200 z-[9999] animate-datepicker-fade-slide"
          style={{ zIndex: 9999 }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={date => {
              setOpen(false);
              onChange(date ? date.toISOString().slice(0, 10) : null);
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
