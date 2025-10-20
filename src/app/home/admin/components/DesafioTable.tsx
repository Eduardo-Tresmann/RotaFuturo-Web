'use client';

import React from 'react';
import { Desafio } from '@/services/desafioService';
import { Edit, Trash2 } from 'lucide-react';

interface DesafioTableProps {
  desafios: Desafio[];
  onEdit: (desafio: Desafio) => void;
  onDelete: (id: number) => void;
}

export function DesafioTable({ desafios, onEdit, onDelete }: DesafioTableProps) {
  if (desafios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum desafio encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              Nível
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              Área
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
              Subárea
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {desafios.map((desafio) => (
            <tr
              key={desafio.desId}
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-4 py-3 text-sm dark:text-gray-300">{desafio.desId}</td>
              <td className="px-4 py-3 text-sm font-medium dark:text-gray-200">
                {desafio.desTitulo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {desafio.desDescricao?.substring(0, 50)}
                {desafio.desDescricao && desafio.desDescricao.length > 50 ? '...' : ''}
              </td>
              <td className="px-4 py-3 text-sm dark:text-gray-300">
                {desafio.nivel?.nivDescricao || '-'}
              </td>
              <td className="px-4 py-3 text-sm dark:text-gray-300">
                {desafio.area?.areaDescricao || '-'}
              </td>
              <td className="px-4 py-3 text-sm dark:text-gray-300">
                {desafio.areaSub?.areasDescricao || '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(desafio)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(desafio.desId)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
