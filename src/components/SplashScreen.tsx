'use client';
import React, { FC } from 'react';

export const SplashScreen: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-200 dark:bg-zinc-900">
      
      <div className="flex flex-1 flex-col items-center justify-center w-full animate-fadein">
        <div className="relative w-[200px] h-[100px] flex items-center justify-center">
          <div
            className="logo-fadein animate-logo-fadein"
            style={{
              width: '200px',
              height: '100px',
              backgroundImage: 'url(/imagens/rf.svg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
            }}
          />
        </div>
        <div className="w-56 border-b-2 border-zinc-800 dark:border-zinc-100 mt-2 animate-slidein delay-300" />
      
      </div>
     
      <style jsx>{`
        
        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slidein {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadein {
          animation: fadein 0.8s ease forwards;
        }
        .animate-slidein {
          animation: slidein 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
       
        @keyframes logo-fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-logo-fadein {
          animation: logo-fadein 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </div>
  );
};
