'use client';
import React, { useState, useEffect } from 'react';
import { EmailField } from '../../../../components/ui/form-components/email-field';
import { PasswordField } from '../../../../components/ui/form-components/password-field';
import { Usuario } from '../../../../types/usuario';
import { usuarioService } from '@/services/usuario/UsuarioService';
import { authService } from '@/services/auth/AuthService';
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
        // Usar o mesmo fluxo de registro do authService (usado em /auth)
        if (!form.usuEmail || !form.usuSenha) {
          error({ message: 'Preencha email e senha.' });
          return;
        }
        await authService.registrar(form.usuEmail, form.usuSenha);
        success({ message: 'Usuário criado com sucesso!' });
      }
      if (onClose) onClose();
    } catch (err: any) {
      error({ message: err?.message || 'Erro ao salvar usuário.' });
    }
  }

  return (
    <section className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl p-6 flex flex-col gap-6 shadow-soft">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-blue-300 text-center">{form.usuId ? 'Editar Usuário' : 'Cadastro de Usuário'}</h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <EmailField
          name="usuEmail"
          label={<span className="font-medium text-zinc-700 dark:text-zinc-200">E-mail</span>}
          value={form.usuEmail || ''}
          onChange={handleChange}
          required
          className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
        />
        <PasswordField
          name="usuSenha"
          label={<span className="font-medium text-zinc-700 dark:text-zinc-200">Senha</span>}
          value={form.usuSenha || ''}
          onChange={handleChange}
          required
          className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-100 dark:placeholder:text-neutral-400"
        />
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              name="usuEmailValidado"
              type="checkbox"
              checked={!!form.usuEmailValidado}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-200">Email Validado</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              name="usuAtivo"
              type="checkbox"
              checked={!!form.usuAtivo}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-200">Ativo</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              name="usuTrocaSenha"
              type="checkbox"
              checked={!!form.usuTrocaSenha}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-200">Troca Senha</span>
          </label>
        </div>
        <div className="flex justify-end mt-2 gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-xl px-8 py-3 font-bold shadow hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Salvar
          </button>
          {onClose && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 rounded-xl px-8 py-3 font-bold shadow hover:bg-gray-400 transition dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
