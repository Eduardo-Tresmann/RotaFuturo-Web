
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import ptBR from './ptBR-datepicker';

interface DateFieldProps {
  label?: string;
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
  name?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  required,
  name,
  minDate,
  maxDate,
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-zinc-700 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={date => onChange(date ? (date as Date).toISOString().slice(0, 10) : null)}
          dateFormat="yyyy-MM-dd"
          className="flex h-12 w-full rounded-xl border-2 border-zinc-200 bg-white px-10 py-3 text-sm ring-offset-background placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow"
          name={name}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Selecione a data"
          locale={ptBR}
          renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
            <div className="flex items-center justify-between px-2 py-2 bg-blue-50 rounded-t-lg border-b border-blue-100">
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); decreaseMonth(); }}
                disabled={prevMonthButtonDisabled}
                className="text-zinc-400 px-2 py-1 rounded hover:bg-zinc-200 transition disabled:opacity-40"
                type="button"
              >{'<'}</button>
              <span className="text-blue-700 font-semibold text-base">
                {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); increaseMonth(); }}
                disabled={nextMonthButtonDisabled}
                className="text-zinc-400 px-2 py-1 rounded hover:bg-zinc-200 transition disabled:opacity-40"
                type="button"
              >{'>'}</button>
            </div>
          )}
          calendarClassName="!border-zinc-200 !shadow-lg !rounded-xl !bg-white"
          dayClassName={date =>
            'text-zinc-700 font-medium hover:bg-blue-100 focus:bg-blue-200 rounded-full transition-all duration-100' +
            (date.toDateString() === (value ? new Date(value).toDateString() : '') ? ' !bg-blue-500 !text-white' : '')
          }
          weekDayClassName={() => 'text-zinc-400 font-semibold text-xs'}
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500 pointer-events-none" />
      </div>
    </div>
  );
};
