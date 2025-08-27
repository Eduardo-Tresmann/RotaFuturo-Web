import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 transition flex items-center gap-2"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
      
    </button>
  );
}
