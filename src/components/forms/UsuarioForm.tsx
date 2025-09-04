'use client';
import React, { useState, useEffect } from 'react';
import { EmailField } from '../ui/form-components/email-field';
import { PasswordField } from '../ui/form-components/password-field';
import { Usuario } from '../../types/usuario';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { FormNotification } from '@/components/ui/form-components/form-notification';

interface UsuarioFormProps {
  usuario?: Usuario;
  onClose?: () => void;
}

const initialState: Partial<Usuario> = {
  usuEmail: '',
  usuSenha: '',
  usuEmailValidado: false,
  usuAtivo: true,
  usuTrocaSenha: false,
};

export default function UsuarioForm({ usuario, onClose }: UsuarioFormProps) {
  const [form, setForm] = useState<Partial<Usuario>>(initialState);
  const { error, success } = FormNotification;

  useEffect(() => {
    if (usuario) {
      // Preenche os dados, mas deixa a senha sempre vazia
      setForm({ ...usuario, usuSenha: '' });
    } else {
      setForm(initialState);
    }
  }, [usuario]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (form.usuId) {
        // Só envia a senha se o usuário digitou uma nova
        const payload = { ...form };
        if (!payload.usuSenha) {
          delete payload.usuSenha;
        }
        await usuarioService.updateUser(form.usuId, payload);
        success({ message: 'Usuário atualizado com sucesso!' });
      } else {
        // TODO: Implementar criação de usuário se necessário
        error({ message: 'Criação de usuário não implementada.' });
      }
      if (onClose) onClose();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar usuário.' });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Cadastro de Usuário</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <EmailField
            name="usuEmail"
            label={<span>Email</span>}
            value={form.usuEmail || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-1">
          <PasswordField
            name="usuSenha"
            label={<span>Senha</span>}
            value={form.usuSenha || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-3 flex gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              name="usuEmailValidado"
              type="checkbox"
              checked={!!form.usuEmailValidado}
              onChange={handleChange}
            />{' '}
            Email Validado
          </label>
          <label className="flex items-center gap-2">
            <input
              name="usuAtivo"
              type="checkbox"
              checked={!!form.usuAtivo}
              onChange={handleChange}
            />{' '}
            Ativo
          </label>
          <label className="flex items-center gap-2">
            <input
              name="usuTrocaSenha"
              type="checkbox"
              checked={!!form.usuTrocaSenha}
              onChange={handleChange}
            />{' '}
            Troca Senha
          </label>
        </div>
        <div className="md:col-span-3 flex justify-end mt-8 gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition"
          >
            Salvar
          </button>
          {onClose && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 rounded-xl px-8 py-3 font-bold shadow hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
