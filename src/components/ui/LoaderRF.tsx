import React from 'react';
export function LoaderRF({ className = '', style = {} }) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center w-full h-full bg-black/30 backdrop-blur-md ${className}`}
      style={{ zIndex: 9999, ...style }}
    >
      <img
        src="/imagens/rf.svg"
        alt="Carregando..."
        className="animate-fade-in-out drop-shadow-lg"
        style={{ width: 64, height: 64, ...style }}
      />
    </div>
  );
}
