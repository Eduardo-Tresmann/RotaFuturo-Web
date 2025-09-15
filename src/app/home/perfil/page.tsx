'use client';

import { HeaderHome } from '@/components/HeaderHome';


import { Button } from '@/components/ui/button';
import { KeyRound, Edit3 } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/context/AuthContext';
import { usuarioService } from '@/services/usuario/UsuarioService';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { usePessoa } from '@/hooks/usePessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { Pessoa } from '@/types/pessoa';
import { TextField } from '@/components/ui/form-components/text-field';
import { PasswordField } from '@/components/ui/form-components/password-field';
import { DateField } from '@/components/ui/form-components/date-field';
import { PhoneField } from '@/components/ui/form-components/phone-field';
import { FileField } from '@/components/ui/form-components/file-field';
import { User, AtSign, Calendar, Phone, Image as ImageIcon, Tag } from 'lucide-react';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { getFileName } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

const icons = {
  nome: (
    <svg
      className="w-5 h-5 text-gray-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5"
      />
    </svg>
  ),
  apelido: (
    <svg
      className="w-5 h-5 text-pink-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.75c-4.556 0-8.25 1.843-8.25 4.125v6.25c0 2.282 3.694 4.125 8.25 4.125s8.25-1.843 8.25-4.125v-6.25c0-2.282-3.694-4.125-8.25-4.125z"
      />
    </svg>
  ),
  email: (
    <svg
      className="w-5 h-5 text-emerald-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L3.409 8.584A2.25 2.25 0 012.75 6.993V6.75"
      />
    </svg>
  ),
  status: (
    <svg
      className="w-5 h-5 text-yellow-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  ),
  nascimento: (
    <svg
      className="w-5 h-5 text-purple-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10m-12 8V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  ),
  telefone: (
    <svg
      className="w-5 h-5 text-cyan-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75m-19.5 0A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25m-19.5 0v.243a2.25 2.25 0 00.659 1.591l7.091 7.091a2.25 2.25 0 003.182 0l7.091-7.091a2.25 2.25 0 00.659-1.591V6.75"
      />
    </svg>
  ),
  nivel: (
    <svg
      className="w-5 h-5 text-indigo-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.25l6.16-3.422a.75.75 0 00.34-.978l-2.34-6.16a.75.75 0 00-.978-.34L12 7.75l-3.182-1.4a.75.75 0 00-.978.34l-2.34 6.16a.75.75 0 00.34.978L12 17.25z"
      />
    </svg>
  ),
  xp: (
    <svg
      className="w-5 h-5 text-orange-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  ),
  cadastro: (
    <svg
      className="w-5 h-5 text-gray-500 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10m-12 8V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  ),
};

export default function PaginaPerfil() {
  const { usuario, authResolved } = useAuthContext();
  const { pessoa, setPessoa, loading } = usePessoa();

  const [sidebarTab, setSidebarTab] = useState<'perfil' | 'editar' | 'senha'>('perfil');
  const [form, setForm] = useState<Partial<Pessoa>>({});
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [previewCapa, setPreviewCapa] = useState<string | null>(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  useEffect(() => {
    if (!loading && pessoa) {
      setForm(pessoa);
      // Exibir imagem/capa do banco ao abrir o form, mas só trocar se escolher novo arquivo
      if (pessoa.pesImagemperfil && pessoa.pesImagemperfil.startsWith('storage/')) {
        setPreviewImagem(
          `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
            pessoa.pesImagemperfil,
          )}`,
        );
      } else {
        setPreviewImagem(null);
      }
      if (pessoa.pesImagemCapaPerfil && pessoa.pesImagemCapaPerfil.startsWith('storage/')) {
        setPreviewCapa(
          `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
            pessoa.pesImagemCapaPerfil,
          )}`,
        );
      } else {
        setPreviewCapa(null);
      }
    }
  }, [loading, pessoa, usuario]);

  // LoaderRF agora é global pelo layout

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreviewImagem(ev.target.result as string);
        setForm((prev) => ({
          ...prev,
          pesImagemperfil: (ev.target?.result as string).split(',')[1],
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCapaUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreviewCapa(ev.target.result as string);
        setForm((prev) => ({
          ...prev,
          pesImagemCapaPerfil: (ev.target?.result as string).split(',')[1],
        }));
      }
    };
    reader.readAsDataURL(file);
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
      let pessoaAtualizada;
      if (!pessoa) {
        pessoaAtualizada = await pessoaService.createPessoa(formComUsuario);
      } else {
        pessoaAtualizada = await pessoaService.updatePessoa(pessoa.pesId, formComUsuario);
      }
      setPessoa(pessoaAtualizada);
      FormNotification.success({
        message: 'Perfil salvo com sucesso!',
        duration: 4000,
        position: 'top-center',
      });
      setSidebarTab('perfil');
    } catch (error) {
      FormNotification.error({
        message: 'Erro ao salvar perfil.',
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      FormNotification.error({
        message: 'Preencha todos os campos.',
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    if (novaSenha !== confirmaSenha) {
      FormNotification.error({
        message: 'As senhas não coincidem.',
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    setLoadingSenha(true);
    try {
      if (!usuario?.usuId) throw new Error('Usuário não identificado');
      await usuarioService.alterarSenha(usuario.usuId, novaSenha);
      FormNotification.success({
        message: 'Senha alterada com sucesso!',
        duration: 4000,
        position: 'top-center',
      });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaSenha('');
      setSidebarTab('perfil');
    } catch (error) {
      FormNotification.error({
        message: 'Erro ao alterar senha.',
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setLoadingSenha(false);
    }
  };

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
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
  <div className="flex flex-row min-h-screen h-screen bg-gray-50 dark:bg-neutral-950 font-montserrat transition-colors duration-200">
      <Sidebar className="!h-screen !min-h-screen !w-72 !rounded-none !border-r !border-gray-200 dark:!border-neutral-700 !bg-white dark:!bg-neutral-950 shadow-md">
          <SidebarItem
            active={sidebarTab === 'perfil'}
            icon={<User className="w-5 h-5" />}
            onClick={() => setSidebarTab('perfil')}
            className={sidebarTab === 'perfil' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}
          >
            Perfil
          </SidebarItem>
          <SidebarItem
            active={sidebarTab === 'editar'}
            icon={<Edit3 className="w-5 h-5" />}
            onClick={() => setSidebarTab('editar')}
            className={sidebarTab === 'editar' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}
          >
            Editar Perfil
          </SidebarItem>
          <SidebarItem
            active={sidebarTab === 'senha'}
            icon={<KeyRound className="w-5 h-5" />}
            onClick={() => setSidebarTab('senha')}
            className={sidebarTab === 'senha' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}
          >
            Alterar Senha
          </SidebarItem>
        </Sidebar>
        <div className="flex-1 flex flex-col w-full">
          <div className="w-full h-40 md:h-56 bg-gray-100 dark:bg-neutral-900 relative flex items-end justify-start overflow-hidden shadow-lg transition-colors duration-200">
            {previewCapa ? (
              <img
                src={previewCapa}
                alt="Capa do perfil"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900" />
            )}
            <div className="relative z-10 flex items-end h-full w-full px-10 pb-6">
              <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center overflow-hidden">
                  {previewImagem ? (
                    <img
                      src={previewImagem}
                      alt="Perfil"
                      className="w-32 h-32 rounded-full object-cover transition-opacity duration-300"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div className="bg-black/50 dark:bg-black/60 px-6 py-2 rounded-2xl shadow-lg flex flex-col items-start max-w-full min-w-0 border border-gray-300/20 dark:border-gray-700/50">
                  <h1 className="text-4xl font-bold text-white dark:text-gray-50 drop-shadow-lg whitespace-normal break-words">
                    {pessoa?.pesNome}
                  </h1>
                  <div className="text-lg text-gray-300 dark:text-gray-400 font-bold tracking-wide whitespace-normal break-words">{pessoa?.pesApelido}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full py-6 px-4">
            <div className="w-full">
                {sidebarTab === 'perfil' && pessoa && usuario && (
                  <div className="w-full bg-gray-100 dark:bg-neutral-900 rounded-2xl shadow-lg p-10 mt-0 flex flex-col gap-8 border-t border-x border-gray-200 dark:border-neutral-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <svg
                        className="w-7 h-7 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5"
                        />
                      </svg>
                      Informações do Perfil
                    </div>
                    <div className="flex flex-col gap-6 font-montserrat">
                      <div className="flex items-center gap-2">
                        {icons.nome}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Nome</div>
                          <div className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                            {pessoa.pesNome}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.apelido}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Apelido</div>
                          <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">
                            {pessoa.pesApelido}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.email}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">E-mail</div>
                          <div className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                            {usuario.usuEmail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.status}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Status</div>
                          <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">
                            {usuario.usuAtivo ? 'Ativo' : 'Inativo'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.nascimento}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Data de Nascimento</div>
                          <div className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                            {pessoa.pesDatanascimento}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.telefone}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Telefone</div>
                          <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">
                            {pessoa.pesTelefone1}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.nivel}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Nível</div>
                          <div className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                            {pessoa.pesNivel ?? '-'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.xp}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">XP</div>
                          <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">
                            {pessoa.pesXp ?? '-'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {icons.cadastro}
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold">Data de Cadastro</div>
                          <div className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100">
                            {usuario.usuDataCadastro}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {sidebarTab === 'editar' && (
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-8 mt-10 bg-gray-50 dark:bg-neutral-800 rounded-2xl shadow-lg p-10 border-t border-x border-gray-200 dark:border-neutral-700"
                  >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <User className="w-6 h-6 text-gray-600" /> Editar Perfil
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Linha 1: CAPA | PERFIL */}
                      <FileField
                        label="Imagem de Capa"
                        accept="image/*"
                        onlyImages={true}
                        onChange={(e) => handleCapaUpload(e.target.files?.[0] ?? null)}
                        className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-neutral-400 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 hover:border-neutral-500 dark:hover:border-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 dark:file:bg-neutral-800 file:text-gray-700 dark:file:text-gray-200 file:cursor-pointer"
                      />
                      <FileField
                        label="Foto de Perfil"
                        accept="image/*"
                        onlyImages={true}
                        onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                        className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-neutral-400 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 hover:border-neutral-500 dark:hover:border-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 dark:file:bg-neutral-800 file:text-gray-700 dark:file:text-gray-200 file:cursor-pointer"
                      />
                      {/* Linha 2: NOME | APELIDO */}
                      <TextField
                        label="Nome"
                        name="pesNome"
                        value={form.pesNome ?? ''}
                        onChange={handleChange}
                        required
                        icon={User}
                        iconColor="text-gray-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                      <TextField
                        label="Apelido"
                        name="pesApelido"
                        value={form.pesApelido ?? ''}
                        onChange={handleChange}
                        required
                        icon={Tag}
                        iconColor="text-pink-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                     
                      <DateField
                        label="Data de Nascimento"
                        name="pesDatanascimento"
                        value={form.pesDatanascimento ?? ''}
                        onChange={(date) =>
                          setForm((f) => ({ ...f, pesDatanascimento: date || undefined }))
                        }
                        required
                      />
                      <PhoneField
                        label="Telefone"
                        name="pesTelefone1"
                        value={form.pesTelefone1 ?? ''}
                        onChange={handleChange}
                        icon={Phone}
                        iconColor="text-cyan-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="rounded dark:bg-neutral-800/70 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        onClick={() => {
                          setSidebarTab('perfil');
                          setForm(pessoa ?? {});
                          if (
                            pessoa?.pesImagemperfil &&
                            pessoa.pesImagemperfil.startsWith('storage/')
                          ) {
                            setPreviewImagem(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                                usuario?.usuId
                              }/${getFileName(pessoa.pesImagemperfil)}`,
                            );
                          } else {
                            setPreviewImagem(null);
                          }
                          if (
                            pessoa?.pesImagemCapaPerfil &&
                            pessoa.pesImagemCapaPerfil.startsWith('storage/')
                          ) {
                            setPreviewCapa(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                                usuario?.usuId
                              }/${getFileName(pessoa.pesImagemCapaPerfil)}`,
                            );
                          } else {
                            setPreviewCapa(null);
                          }
                        }}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-neutral-700 hover:bg-neutral-600 text-white rounded shadow dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </form>
                )}
                {sidebarTab === 'senha' && (
                  <form
                    onSubmit={handleSenha}
                    className="w-full flex flex-col gap-8 mt-10 bg-gray-50 dark:bg-neutral-800 rounded-2xl shadow-lg p-10 border-t border-x border-gray-200 dark:border-neutral-700 animate-fade-in"
                  >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <KeyRound className="w-7 h-7 text-gray-600" /> Alterar Senha
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <PasswordField
                        label="Senha Atual"
                        name="senhaAtual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-gray-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                      <PasswordField
                        label="Nova Senha"
                        name="novaSenha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-gray-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                      <PasswordField
                        label="Confirmar Nova Senha"
                        name="confirmaSenha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-gray-500"
                        className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 dark:placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                      />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="rounded dark:bg-neutral-800/70 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-700"
                        onClick={() => {
                          setSidebarTab('perfil');
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmaSenha('');
                        }}
                        disabled={loadingSenha}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-neutral-700 hover:bg-neutral-600 text-white rounded shadow dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
                        disabled={loadingSenha}
                      >
                        {loadingSenha ? 'Salvando...' : 'Alterar Senha'}
                      </Button>
                    </div>
                  </form>
                )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
