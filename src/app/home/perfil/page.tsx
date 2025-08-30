'use client';

import { HeaderHome } from '@/components/HeaderHome';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/context/AuthContext';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { usePessoa } from '@/hooks/usePessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { Pessoa } from '@/types/index';
import { TextField, EmailField, PhoneField, NumberField } from '@/components/ui/form-components/form-components';
import { FileInput } from '@/components/ui/form-components/fileinput';
import { arquivoService } from '@/services/arquivoService';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { getFileName } from '@/lib/utils';


export default function PaginaPerfil() {
  const { usuario, logout, isAuthenticated } = useAuthContext();
  const { pessoa, setPessoa, loading } = usePessoa();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Pessoa>>({});
  const [uploading, setUploading] = useState(false);
   const [previewImagem, setPreviewImagem] = useState<string | null>(null);


  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
    if (editMode && pessoa) {
      setForm(pessoa);
    }
  }, [isAuthenticated, router, editMode, pessoa]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.pesNome || !form.pesApelido) {
        FormNotification.error({
          message: 'Preencha nome e apelido.',
          duration: 4000,
          position: 'top-center',
        });
        return;
      }

      const formComUsuario = { ...form, usuId: usuario?.usuId ?? pessoa?.usuId };

      if (!pessoa) {
        await pessoaService.createPessoa(formComUsuario);
        FormNotification.success({
          message: 'Perfil criado com sucesso!',
          duration: 4000,
          position: 'top-center',
        });
      } else {
        await pessoaService.updatePessoa(pessoa.pesId, formComUsuario);
        FormNotification.success({
          message: 'Perfil atualizado com sucesso!',
          duration: 4000,
          position: 'top-center',
        });
      }

      const perfilAtualizado = await pessoaService.getMyPessoa();
      setPessoa(perfilAtualizado);
      setEditMode(false);

    } catch (error) {
      FormNotification.error({
        message: 'Erro ao salvar perfil.',
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file || !usuario?.usuId) return;
    // Preview local imediato
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) setPreviewImagem(ev.target.result as string);
    };
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const response = await arquivoService.uploadFotoPerfil(file, usuario.usuId);
      if (response?.url) {
        if (pessoa?.pesId) {
          const dadosAtualizados = { ...form, pesImagemperfil: response.url };
          await pessoaService.updatePessoa(pessoa.pesId, dadosAtualizados);
          const perfilAtualizado = await pessoaService.getMyPessoa();
          setPessoa(perfilAtualizado);
          if (perfilAtualizado) setForm(perfilAtualizado);
        } else {
          setForm({ ...form, pesImagemperfil: response.url });
          setPessoa(prev => prev ? { ...prev, pesImagemperfil: response.url } : prev);
        }
        setPreviewImagem(null); 
      }
      FormNotification.success({ message: 'Foto enviada!', duration: 3000 });
    } catch (err) {
      FormNotification.error({ message: 'Erro ao enviar foto', duration: 3000 });
    } finally {
      setUploading(false);
    }
  };


  return (
    <ProtectedRoute>
      <HeaderHome
        extra={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home/dashboard">Dashboard</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      {editMode ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-zinc-100 flex items-center justify-center px-4 py-8">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-10 border border-zinc-100">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-zinc-200 flex items-center justify-center overflow-hidden shadow-lg border-4 border-blue-200">
                    {previewImagem ? (
                      <img src={previewImagem} alt="Preview" className="w-28 h-28 object-cover" />
                    ) : form.pesImagemperfil ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${form.pesImagemperfil}`} alt="Foto de perfil" className="w-28 h-28 object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-blue-300" />
                    )}
                  </div>
                  <FileInput
                    label="Enviar nova foto"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-1" onClick={() => setForm({ ...form, pesImagemperfil: '' })}>Remover foto</Button>
                  {uploading && <span className="text-xs text-blue-600 mt-2">Enviando foto...</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <TextField
                    name="pesNome"
                    id="pesNome"
                    label="Nome"
                    required
                    value={form.pesNome ?? ''}
                    onChange={handleChange}
                    placeholder="Nome completo"
                  />
                  <TextField
                    name="pesApelido"
                    id="pesApelido"
                    label="Apelido"
                    value={form.pesApelido ?? ''}
                    onChange={handleChange}
                    placeholder="Apelido"
                  />
                  <EmailField
                    name="email"
                    id="email"
                    label="E-mail"
                    value={usuario?.usuEmail ?? ''}
                    disabled
                  />
                  <PhoneField
                    name="pesTelefone1"
                    id="pesTelefone1"
                    label="Telefone"
                    value={form.pesTelefone1 ?? ''}
                    onChange={handleChange}
                    placeholder="(99) 99999-9999"
                  />
                  <TextField
                    name="pesDatanascimento"
                    id="pesDatanascimento"
                    label="Data de Nascimento"
                    type="date"
                    value={form.pesDatanascimento ?? ''}
                    onChange={handleChange}
                  />
                  
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <Button type="submit" size="lg" className="bg-blue-600 text-white rounded-xl shadow">Salvar alterações</Button>
                <Button type="button" size="lg" variant="outline" className="rounded-xl" onClick={() => setEditMode(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-zinc-100 p-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft p-8 flex flex-col items-center col-span-1">
              <div className="w-24 h-24 rounded-full bg-zinc-200 flex items-center justify-center mb-4">
                {pessoa?.pesImagemperfil && usuario?.usuId ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario.usuId}/${getFileName(pessoa.pesImagemperfil)}`}
                    alt="Perfil"
                    className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-zinc-400" />
                )}



              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-1">{pessoa?.pesNome || 'Nome do Usuário'}</h2>
              <p className="text-zinc-500 mb-2">{pessoa?.pesApelido || 'Apelido'}</p>
              <p className="text-zinc-600 mb-4">{usuario?.usuEmail}</p>
              <p className="text-zinc-400 mb-4">{pessoa?.pesDatanascimento ? `Nascimento: ${pessoa.pesDatanascimento}` : ''}</p>
              <div className="flex gap-2 mt-2">
                {/* Removidos botões "Seguir" e "Mensagem" pois não implementados */}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 col-span-2 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Informações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-700">
                <div>
                  <div className="mb-2"><span className="font-semibold">Nome:</span> {pessoa?.pesNome}</div>
                  <div className="mb-2"><span className="font-semibold">Email:</span> {usuario?.usuEmail}</div>
                  <div className="mb-2"><span className="font-semibold">Telefone 1:</span> {pessoa?.pesTelefone1}</div>
                  <div className="mb-2"><span className="font-semibold">Telefone 2:</span> {pessoa?.pesTelefone2}</div>
                </div>
                <div>
                  <div className="mb-2"><span className="font-semibold">Nível:</span> {pessoa?.pesNivel}</div>
                  <div className="mb-2"><span className="font-semibold">XP:</span> {pessoa?.pesXp}</div>
                  <div className="mb-2"><span className="font-semibold">Currículo:</span> {pessoa?.pesImagemcurriculo ? <a href={pessoa.pesImagemcurriculo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver Currículo</a> : 'Não informado'}</div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button onClick={() => { setForm(pessoa || {}); setEditMode(true); }} size="lg" className="bg-zinc-900 text-white">Editar Perfil</Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 flex flex-col gap-4 items-center col-span-1 md:col-span-1">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Redes Sociais</h3>
              <div className="w-full flex flex-col gap-2">
                <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-zinc-50 transition"><span className="text-xl">🌐</span> <span>Seu site</span></a>
                <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-zinc-50 transition"><span className="text-xl">🐦</span> <span>@usuario</span></a>
                <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-zinc-50 transition"><span className="text-xl">📸</span> <span>@usuario</span></a>
                <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-zinc-50 transition"><span className="text-xl">💼</span> <span>@usuario</span></a>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft p-8 flex flex-col gap-4 col-span-2 md:col-span-2">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Carreira</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Matemática', 'Física', 'Tecnologia', 'Filosofia', 'Desenvolvimento'].map((project, idx) => (
                  <div key={project} className="mb-2">
                    <span className="text-blue-600 font-medium">{project}</span>
                    <div className="w-full h-2 bg-zinc-200 rounded mt-1">
                      <div className="h-2 rounded bg-blue-500" style={{ width: `${40 + idx * 12}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}