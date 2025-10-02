'use client';
import { HeaderHome } from '@/components/HeaderHome';
import { Button } from '@/components/ui/button';
import {
  KeyRound,
  Edit3,
  Edit2,
  User,
  AtSign,
  Calendar,
  Phone,
  Image as ImageIcon,
  Tag,
  MapPin,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/context/AuthContext';
import { usuarioService } from '@/services/usuario/UsuarioService';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { usePessoa } from '@/hooks/usePessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';

// Declaração de tipo para process.env
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};
import { Pessoa } from '@/types/pessoa';
import { TextField } from '@/components/ui/form-components/text-field';
import { PasswordField } from '@/components/ui/form-components/password-field';
import { DateField } from '@/components/ui/form-components/date-field';
import { PhoneField } from '@/components/ui/form-components/phone-field';
import { FileField } from '@/components/ui/form-components/file-field';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      FormNotification.error({
        message: 'Por favor, selecione apenas arquivos de imagem.',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setPreviewImagem(dataUrl);

        // Get the base64 data without the prefix
        const base64Data = dataUrl.split(',')[1];

        setForm((prev) => ({
          ...prev,
          pesImagemperfil: base64Data,
        }));

        FormNotification.success({
          message: 'Imagem de perfil selecionada com sucesso!',
          duration: 2000,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCapaUpload = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      FormNotification.error({
        message: 'Por favor, selecione apenas arquivos de imagem.',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setPreviewCapa(dataUrl);

        // Get the base64 data without the prefix
        const base64Data = dataUrl.split(',')[1];

        setForm((prev) => ({
          ...prev,
          pesImagemCapaPerfil: base64Data,
        }));

        FormNotification.success({
          message: 'Imagem de capa selecionada com sucesso!',
          duration: 2000,
        });
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

      // Prepare form data with images
      const formComUsuario = {
        ...form,
        usuId: usuario?.usuId ?? pessoa?.usuId,
        // Ensure image fields are passed properly
        pesImagemperfil: form.pesImagemperfil || pessoa?.pesImagemperfil || '',
        pesImagemCapaPerfil: form.pesImagemCapaPerfil || pessoa?.pesImagemCapaPerfil || '',
      };

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

      // Update preview image URLs if they were updated
      if (form.pesImagemperfil && !form.pesImagemperfil.startsWith('storage/')) {
        // The image was updated in this session
        // The backend will handle saving and will return the proper URL
        if (pessoaAtualizada.pesImagemperfil) {
          setPreviewImagem(
            `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
              pessoaAtualizada.pesImagemperfil,
            )}`,
          );
        }
      }

      if (form.pesImagemCapaPerfil && !form.pesImagemCapaPerfil.startsWith('storage/')) {
        // The image was updated in this session
        if (pessoaAtualizada.pesImagemCapaPerfil) {
          setPreviewCapa(
            `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
              pessoaAtualizada.pesImagemCapaPerfil,
            )}`,
          );
        }
      }

      // Show profile tab
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
                <BreadcrumbPage>Meu Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 font-montserrat transition-colors duration-200 overflow-hidden">
        {}
        <Sidebar className="hidden md:block md:!h-auto md:!w-72 !rounded-none !border-r !border-gray-200 dark:!border-neutral-700 !bg-white dark:!bg-neutral-950 shadow-md">
          <div className="py-6 px-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Meu Perfil</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie suas informações pessoais
            </p>
          </div>

          <div className="py-3">
            <SidebarItem
              active={sidebarTab === 'perfil'}
              icon={<User className="w-5 h-5" />}
              onClick={() => setSidebarTab('perfil')}
              className={
                sidebarTab === 'perfil'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800/70'
              }
            >
              Informações Pessoais
            </SidebarItem>
            <SidebarItem
              active={sidebarTab === 'editar'}
              icon={<Edit3 className="w-5 h-5" />}
              onClick={() => setSidebarTab('editar')}
              className={
                sidebarTab === 'editar'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800/70'
              }
            >
              Editar Perfil
            </SidebarItem>
            <SidebarItem
              active={sidebarTab === 'senha'}
              icon={<KeyRound className="w-5 h-5" />}
              onClick={() => setSidebarTab('senha')}
              className={
                sidebarTab === 'senha'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800/70'
              }
            >
              Alterar Senha
            </SidebarItem>
          </div>
        </Sidebar>
        {}
        <div className="md:hidden flex flex-col w-full bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 shadow-sm sticky top-0 z-10">
          <div className="py-3 px-4 border-b border-gray-100 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Meu Perfil</h2>
          </div>

          <div className="flex space-x-1 justify-center overflow-x-auto w-full p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarTab('perfil')}
              className={`whitespace-nowrap flex items-center gap-1 rounded-lg ${
                sidebarTab === 'perfil'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              Informações
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarTab('editar')}
              className={`whitespace-nowrap flex items-center gap-1 rounded-lg ${
                sidebarTab === 'editar'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarTab('senha')}
              className={`whitespace-nowrap flex items-center gap-1 rounded-lg ${
                sidebarTab === 'senha'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              Senha
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto overflow-y-auto">
          <div className="flex-1 flex flex-col gap-6 w-full py-6 sm:py-8 px-4 sm:px-6 md:px-8 pb-16">
            <div className="w-full">
              {sidebarTab === 'perfil' &&
                (pessoa && usuario ? (
                  <>
                    {/* Imagens do Perfil - Estilo Banner */}
                    <div className="overflow-hidden rounded-xl shadow-lg mb-6">
                      <div className="w-full h-48 sm:h-56 bg-gray-100 dark:bg-neutral-900 relative flex items-end justify-start overflow-hidden transition-colors duration-200">
                        {/* Imagem de capa ou gradiente */}
                        {pessoa.pesImagemCapaPerfil ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                              usuario?.usuId
                            }/${getFileName(pessoa.pesImagemCapaPerfil)}`}
                            alt="Capa do perfil"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 opacity-80" />
                        )}

                        {/* Overlay gradiente para melhor visibilidade do texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Conteúdo do banner */}
                        <div className="relative z-10 flex items-end h-full w-full px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 w-full">
                            {/* Foto de perfil */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-offset-white/10 ring-white/20">
                              {pessoa.pesImagemperfil ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                                    usuario?.usuId
                                  }/${getFileName(pessoa.pesImagemperfil)}`}
                                  alt="Foto de perfil"
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 dark:text-gray-500" />
                              )}
                            </div>

                            {/* Nome e apelido */}
                            <div className="flex flex-col items-center sm:items-start max-w-full min-w-0 flex-1">
                              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg whitespace-normal break-words text-center sm:text-left">
                                {pessoa.pesNome}
                              </h3>
                              <div className="text-base text-gray-200 font-medium tracking-wide whitespace-normal break-words text-center sm:text-left">
                                {pessoa.pesApelido}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mt-4 flex flex-col gap-6 sm:gap-8 border border-gray-200/50 dark:border-neutral-800/50">
                      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-2">
                        <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <svg
                              className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400"
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
                          </div>
                          Informações Pessoais
                        </div>
                      </div>

                      <div className="flex flex-col gap-8">
                        {/* Estatísticas */}
                        <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                              Progresso & Conquistas
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center">
                              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-2">
                                {icons.nivel}
                              </div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Nível Atual
                              </span>
                              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {pessoa.pesNivel ?? '0'}
                              </span>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center">
                              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
                                {icons.xp}
                              </div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Pontos de Experiência
                              </span>
                              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {pessoa.pesXp ?? '0'} XP
                              </span>
                            </div>

                            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center sm:col-span-2 lg:col-span-1">
                              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                                {icons.cadastro}
                              </div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Membro desde
                              </span>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {usuario.usuDataCadastro
                                  ? new Date(usuario.usuDataCadastro).toLocaleDateString('pt-BR')
                                  : 'Não informado'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Seus dados pessoais e informações de contato
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                          {/* Dados pessoais */}
                          <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                                Dados Pessoais
                              </h3>
                            </div>

                            <div className="space-y-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Nome Completo
                                </span>
                                <span className="text-base text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                                  {pessoa.pesNome}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Apelido
                                </span>
                                <span className="text-base text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                                  {pessoa.pesApelido}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Data de Nascimento
                                </span>
                                <span className="text-base text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                                  {pessoa.pesDatanascimento
                                    ? new Date(
                                        pessoa.pesDatanascimento + 'T00:00:00',
                                      ).toLocaleDateString('pt-BR')
                                    : 'Não informado'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Contato e status */}
                          <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <AtSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                                Contato
                              </h3>
                            </div>

                            <div className="space-y-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Email
                                </span>
                                <span className="text-base text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center gap-2">
                                  {icons.email}
                                  <span className="break-all truncate">{usuario.usuEmail}</span>
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Telefone
                                </span>
                                <span className="text-base text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center gap-2 overflow-hidden">
                                  {icons.telefone}
                                  <span className="truncate">
                                    {pessoa.pesTelefone1 || 'Não informado'}
                                  </span>
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Status da Conta
                                </span>
                                <span className="text-base font-medium bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 flex items-center gap-2">
                                  {icons.status}
                                  <span
                                    className={`${
                                      usuario.usuAtivo
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}
                                  >
                                    {usuario.usuAtivo ? 'Ativo' : 'Inativo'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center py-12">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg text-center max-w-md">
                      <User className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Dados não disponíveis
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Não foi possível carregar os dados do perfil. Por favor, tente novamente
                        mais tarde.
                      </p>
                    </div>
                  </div>
                ))}
              {sidebarTab === 'editar' && (
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-6 sm:gap-8 mt-4 bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200/50 dark:border-neutral-800/50"
                >
                  <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-2">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Edit3 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      Editar Perfil
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Atualize suas informações pessoais e personalize sua conta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:items-start">
                    {/* Imagens */}
                    <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 sm:p-8 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm lg:order-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                          Imagens do Perfil
                        </h3>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
                            {previewImagem && (
                              <div className="min-w-[64px] mb-2 sm:mb-0">
                                <img
                                  src={previewImagem}
                                  alt="Pré-visualização da foto de perfil"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 dark:border-purple-900 shadow-md"
                                />
                              </div>
                            )}
                            <div className="w-full sm:flex-1">
                              <FileField
                                label="Foto de Perfil"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                                className="border-purple-200 dark:border-purple-900/50 focus-within:ring-2 focus-within:ring-purple-500"
                              />
                              {previewImagem && (
                                <span className="text-xs text-purple-600 dark:text-purple-400 block mt-1 font-medium">
                                  Imagem selecionada
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Recomendamos uma imagem quadrada, com pelo menos 400x400 pixels
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
                            {previewCapa && (
                              <div className="min-w-[96px] w-24 mb-2 sm:mb-0">
                                <img
                                  src={previewCapa}
                                  alt="Pré-visualização da capa"
                                  className="h-14 w-full object-cover rounded border-2 border-blue-200 dark:border-blue-900 shadow-md"
                                />
                              </div>
                            )}
                            <div className="w-full sm:flex-1">
                              <FileField
                                label="Imagem de Capa"
                                accept="image/*"
                                onChange={(e) => handleCapaUpload(e.target.files?.[0] || null)}
                                className="border-blue-200 dark:border-blue-900/50 focus-within:ring-2 focus-within:ring-blue-500"
                              />
                              {previewCapa && (
                                <span className="text-xs text-blue-600 dark:text-blue-400 block mt-1 font-medium">
                                  Imagem selecionada
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Recomendamos uma imagem com proporção 3:1, com pelo menos 1200x400
                            pixels
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informações pessoais */}
                    <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 sm:p-8 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm lg:order-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                          <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                          Dados Pessoais
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <TextField
                          label="Nome Completo"
                          name="pesNome"
                          value={form.pesNome ?? ''}
                          onChange={handleChange}
                          required
                          icon={User}
                          iconColor="text-green-500"
                          className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-base"
                        />
                        <TextField
                          label="Apelido / Nome de Exibição"
                          name="pesApelido"
                          value={form.pesApelido ?? ''}
                          onChange={handleChange}
                          required
                          icon={Tag}
                          iconColor="text-green-500"
                          className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-base"
                        />
                        <div className="relative z-20">
                          <DateField
                            label="Data de Nascimento"
                            name="pesDatanascimento"
                            value={form.pesDatanascimento ?? ''}
                            onChange={(date) =>
                              setForm((f) => ({ ...f, pesDatanascimento: date || undefined }))
                            }
                            required
                          />
                        </div>
                        <PhoneField
                          label="Telefone"
                          name="pesTelefone1"
                          value={form.pesTelefone1 ?? ''}
                          onChange={handleChange}
                          icon={Phone}
                          iconColor="text-green-500"
                          className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 border-t border-gray-200 dark:border-neutral-800 pt-6">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-500 flex items-center justify-center gap-2"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center justify-center gap-2 py-2.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
              {sidebarTab === 'senha' && (
                <form
                  onSubmit={handleSenha}
                  className="w-full flex flex-col gap-6 sm:gap-8 mt-4 bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200/50 dark:border-neutral-800/50"
                >
                  <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-2">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 dark:text-amber-400" />
                      </div>
                      Alterar Senha
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Mantenha sua conta segura atualizando sua senha regularmente
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-neutral-700/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                        Credenciais de Acesso
                      </h3>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-600 dark:text-yellow-400 mt-0.5"
                          >
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                              Dicas de segurança
                            </h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                              Crie uma senha forte usando letras maiúsculas e minúsculas, números e
                              símbolos. Não compartilhe sua senha e evite usar a mesma senha em
                              vários sites.
                            </p>
                          </div>
                        </div>
                      </div>

                      <PasswordField
                        label="Senha Atual"
                        name="senhaAtual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-amber-500"
                        className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 focus:border-amber-500 focus:ring-amber-500"
                      />

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5"></div>

                      <PasswordField
                        label="Nova Senha"
                        name="novaSenha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-amber-500"
                        className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <PasswordField
                        label="Confirmar Nova Senha"
                        name="confirmaSenha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                        iconColor="text-amber-500"
                        className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 border-t border-gray-200 dark:border-neutral-800 pt-6">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-500 flex items-center justify-center gap-2"
                      onClick={() => {
                        setSidebarTab('perfil');
                        setSenhaAtual('');
                        setNovaSenha('');
                        setConfirmaSenha('');
                      }}
                      disabled={loadingSenha}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md flex items-center justify-center gap-2"
                      disabled={loadingSenha}
                    >
                      {loadingSenha ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Alterar Senha
                        </>
                      )}
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
