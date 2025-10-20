'use client';

import React, { useState, useEffect } from 'react';
import {
  Desafio,
  DesafioCreateDTO,
  DesafioUpdateDTO,
  desafioService,
} from '@/services/desafioService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { Area } from '@/types/area';

interface DesafioFormProps {
  desafio?: Desafio;
  onSubmit: () => void;
  onCancel: () => void;
}

interface AreaSub {
  areasId: number;
  areasDescricao: string;
  area?: { areaId: number };
}

export function DesafioForm({ desafio, onSubmit, onCancel }: DesafioFormProps) {
  const [formData, setFormData] = useState({
    desTitulo: desafio?.desTitulo || '',
    desDescricao: desafio?.desDescricao || '',
    nivelId: desafio?.nivel?.nivId || undefined,
    areaId: desafio?.area?.areaId || undefined,
    areaSubId: desafio?.areaSub?.areasId || undefined,
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [subAreas, setSubAreas] = useState<AreaSub[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAreas();
  }, []);

  useEffect(() => {
    if (formData.areaId) {
      loadSubAreas(formData.areaId);
    } else {
      setSubAreas([]);
      setFormData((prev) => ({ ...prev, areaSubId: undefined }));
    }
  }, [formData.areaId]);

  async function loadAreas() {
    try {
      const data = await areaService.listAll();
      setAreas(data);
    } catch (err) {
      console.error('Erro ao carregar áreas:', err);
    }
  }

  async function loadSubAreas(areaId: number) {
    try {
      const data = await areaSubService.listByArea(areaId);
      setSubAreas(data);
    } catch (err) {
      console.error('Erro ao carregar subáreas:', err);
      setSubAreas([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (desafio) {
        // Atualizar
        const updateData: DesafioUpdateDTO = {
          desTitulo: formData.desTitulo,
          desDescricao: formData.desDescricao,
          nivelId: formData.nivelId,
          areaId: formData.areaId,
          areaSubId: formData.areaSubId,
        };
        await desafioService.atualizar(desafio.desId, updateData);
      } else {
        // Criar
        const createData: DesafioCreateDTO = {
          desTitulo: formData.desTitulo,
          desDescricao: formData.desDescricao,
          nivelId: formData.nivelId,
          areaId: formData.areaId,
          areaSubId: formData.areaSubId,
        };
        await desafioService.criar(createData);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar desafio');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={formData.desTitulo}
          onChange={(e) => setFormData({ ...formData, desTitulo: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descrição <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          value={formData.desDescricao}
          onChange={(e) => setFormData({ ...formData, desDescricao: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nível</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={formData.nivelId || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              nivelId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Selecione um nível</option>
          <option value="1">Iniciante</option>
          <option value="2">Intermediário</option>
          <option value="3">Avançado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Área</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={formData.areaId || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              areaId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Selecione uma área</option>
          {areas.map((area) => (
            <option key={area.areaId} value={area.areaId}>
              {area.areaDescricao}
            </option>
          ))}
        </select>
      </div>

      {formData.areaId && subAreas.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Subárea</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={formData.areaSubId || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                areaSubId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">Selecione uma subárea</option>
            {subAreas.map((subArea) => (
              <option key={subArea.areasId} value={subArea.areasId}>
                {subArea.areasDescricao}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : desafio ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
