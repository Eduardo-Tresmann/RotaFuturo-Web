import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const desafios = [
  {
    id: 1,
    label: 'FRONT-END',
    titulo: 'Primeiros Passos',
    descricao: 'Entenda as diferenças entre front-end e back e crie seus primeiros códigos.',
    link: '/desafios/primeiros-passos',
    nivel: 'Iniciante',
  },
  {
    id: 2,
    label: 'AGÊNCIA DE TECNOLOGIA',
    titulo: 'Como ganhar dinheiro com tecnologia',
    descricao: 'Como ganhar dinheiro com tecnologia sem depender de CLT.',
    link: '/desafios/ganhar-dinheiro-tecnologia',
    nivel: 'Intermediário',
  },
  {
    id: 3,
    label: 'FRONT-END',
    titulo: 'Crie sites e landing pages',
    descricao: 'Domine o HTML e CSS, e use IA e templates para criar seus primeiros projetos.',
    link: '/desafios/sites-landing-pages',
    nivel: 'Intermediário',
  },
  {
    id: 4,
    label: 'AGÊNCIA DE TECNOLOGIA',
    titulo: 'Fazendo dinheiro com o que você aprendeu',
    descricao: 'Aprenda a captar clientes, quanto cobrar e aumentar seu valor com UP Sell.',
    link: '/desafios/fazendo-dinheiro',
    nivel: 'Avançado',
  },
];

import { HeaderHome } from '@/components/HeaderHome';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ProtectedRoute from '@/components/context/ProtectedRoute';

export default function DesafiosPage() {
  return (
    <ProtectedRoute>
      <HeaderHome
        extra={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Desafios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="min-h-screen bg-white p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Desafios</h1>
          <div className="space-y-6">
            {desafios.map((desafio, index) => (
              <Link href={desafio.link} key={desafio.id} className="block">
                <Card className="relative border border-gray-300 bg-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                  <div className="absolute top-4 right-4 text-6xl font-extrabold text-gray-300 select-none">
                    {index + 1}
                  </div>
                  <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-semibold">
                    {desafio.label}
                  </div>
                  <CardHeader className="pt-10 pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {desafio.titulo}
                    </CardTitle>
                    <CardDescription className="text-gray-700">{desafio.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {desafio.label.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{desafio.nivel}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
