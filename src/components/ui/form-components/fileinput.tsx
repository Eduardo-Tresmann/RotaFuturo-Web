import React from 'react';
interface FileInputProps {
  onChange: (file: File | null) => void;
  label?: string;
  accept?: string;
}
export const FileInput: React.FC<FileInputProps> = ({ onChange, label, accept }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-sm font-semibold text-zinc-700 mb-2">{label}</label>}
      <input
        type="file"
        accept={accept}
        className="flex h-12 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow"
        onChange={e => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
};
