"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DesafioCardProps {
  number: number;
  tag: string;
  title: string;
  description: string;
  highlight?: boolean;
  isCurrent?: boolean;
}

const DesafioCard: React.FC<DesafioCardProps> = ({
  number,
  tag,
  title,
  description,
  highlight = false,
  isCurrent = false,
}) => {
  return (
    <div
      className={`relative rounded-lg p-6 shadow-md border ${
        highlight
          ? "bg-yellow-400 border-yellow-400 text-black"
          : "bg-zinc-800 border-zinc-700 text-white"
      } ${isCurrent ? "border-lime-400" : ""}`}
    >
      {isCurrent && (
        <div className="absolute -top-4 left-4 bg-lime-500 text-black px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 9V7a5 5 0 00-10 0v2m-2 0a2 2 0 012-2h8a2 2 0 012 2m-6 11v-6m-4 6h8"
            />
          </svg>
          Você está aqui
        </div>
      )}
      <div className="flex justify-between items-start">
      <span
        className={`inline-block uppercase text-xs font-bold px-2 py-0.5 rounded border ${
          highlight ? "border-black bg-yellow-300 text-black" : "border-zinc-600 text-zinc-400"
        }`}
      >
        {tag}
      </span>
        <span
          className={`text-6xl font-extrabold select-none ${
            highlight ? "text-black/20" : "text-white/20"
          }`}
        >
          {number}
        </span>
      </div>
      <h3 className={`mt-2 font-semibold text-lg ${highlight ? "text-black" : "text-white"}`}>
        {title}
      </h3>
      <p className={`mt-1 text-sm ${highlight ? "text-black" : "text-zinc-300"}`}>
        {description}
      </p>
      <Button
        variant="link"
        size="sm"
        className={`mt-4 p-0 font-semibold flex items-center gap-1 ${
          highlight ? "text-black" : "text-white"
        }`}
      >
        Ver projetos <ArrowRight size={16} />
      </Button>
    </div>
  );
};

const ObjetivoCard: React.FC = () => {
  return (
    <div className="rounded-lg p-6 shadow-md bg-yellow-400 border border-yellow-400 text-black flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-black text-yellow-400 rounded px-2 py-1 font-bold text-sm flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
          </svg>
          +1
        </div>
        <h4 className="font-bold text-lg">Objetivo</h4>
      </div>
      <p className="mb-6 font-semibold">Conquistar seu primeiro cliente</p>
      <Button variant="outline" className="self-start font-semibold">
        →
      </Button>
    </div>
  );
};

export default function DesafiosPage() {
  return (
    <div className="min-h-screen p-8 bg-zinc-900 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Inicie sua Carreira Tech & Full Stack</h1>
          <Button variant="default" size="sm" className="bg-purple-700 hover:bg-purple-800">
            Ver projetos
          </Button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 flex flex-col gap-4">
            <DesafioCard
              number={1}
              tag="Front-end"
              title="Primeiros Passos"
              description="Entenda as diferenças entre front-end e back e crie seus primeiros códigos."
            />
            <DesafioCard
              number={0}
              tag="Agência de Tecnologia"
              title="Como ganhar dinheiro com tecnologia"
              description="Como ganhar dinheiro com tecnologia sem depender de CLT."
            />
            <DesafioCard
              number={2}
              tag="Front-end"
              title="Crie sites e landing pages"
              description="Domine o HTML e CSS, e use IA e templates para criar seus primeiros projetos."
              highlight
              isCurrent
            />
            <DesafioCard
              number={0}
              tag="Agência de Tecnologia"
              title="Fazendo dinheiro com o que você aprendeu"
              description="Aprenda a captar clientes, quanto cobrar e aumentar seu valor com UP Sell."
            />
            <DesafioCard
              number={3}
              tag="Fullstack"
              title="Criando um sistema de captura de Leads"
              description="Use IA, Vibe coding e Supabase para criar seu primeiro projeto Fullstack."
            />
            <DesafioCard
              number={4}
              tag="Linguagem"
              title="Lógica e JavaScript"
              description="Domine a sintaxe da linguagem de programação JavaScript."
            />
            <DesafioCard
              number={5}
              tag="Front-end"
              title="Crie sites com Framework"
              description="Domine o framework React e aprenda a criar SPAs."
            />
            <DesafioCard
              number={6}
              tag="Back-end"
              title="Criando APIs"
              description="Crie seus primeiros projetos Back end com Node e Express."
            />
            <DesafioCard
              number={7}
              tag="Back-end"
              title="Banco de dados"
              description="Domine o banco de dados MySQL e a linguagem SQL."
            />
            <DesafioCard
              number={8}
              tag="Back-end"
              title="Criando sistemas Fullstack"
              description="Utilize os frameworks React e Node+Express para criar sistemas completos."
            />
            <DesafioCard
              number={9}
              tag="Mobile"
              title="Crie aplicativos"
              description="Crie apps para celular com o framework React Native."
            />
            <DesafioCard
              number={10}
              tag="Linguagem"
              title="Introdução ao Python"
              description="Dê os primeiros passos na linguagem de programação Python."
            />
            <Button variant="default" className="mt-4 w-full">
              Todas as Tecnologias
            </Button>
          </div>
          <ObjetivoCard />
        </div>
      </div>
    </div>
  );
}
