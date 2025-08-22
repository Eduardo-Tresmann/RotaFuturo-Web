'use client';
import React, { FC } from 'react';
import Imagem from '@/components/Imagem';

export const SplashScreen: FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-#d3d3d3"
    >
      <header className="bg-zinc-900 text-white w-full shadow-header">
        <div className="w-full py-4 flex items-center justify-center">
          <Imagem
            src="/imagens/rotafuturo.svg"
            alt="rf logo"
            width={200}
            height={100}
          />
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center w-full">
        <Imagem
          src="/imagens/rf.svg"
          alt="rf logo"
          width={200}
          height={100}
          className="h-auto invert"
        />
        <h2
          className="mt-2 mb-2"
          style={{
            fontSize: '3rem',
            fontWeight: '400',
            color: '#222',
            fontFamily: 'Montserrat, Arial, sans-serif',
          }}
        >
          Sejam Bem-vindos
        </h2>
        <div
          style={{
            width: '220px',
            borderBottom: '2px solid #222',
            marginTop: '8px',
          }}
        />
      </div>
    </div>
  );
}