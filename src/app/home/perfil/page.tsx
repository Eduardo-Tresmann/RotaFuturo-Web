'use client';
import { HeaderHome } from '@/components/HeaderHome';
import { Button } from '@/components/ui/button';
import {
  KeyRound,
  Edit3,
  User,
  AtSign,
  Calendar,
  Phone,
  Image as ImageIcon,
  Tag,
  Award,
  AlertTriangle,
  BookOpen,
  Target,
  X,
  Plus,
  Sparkles,
  TrendingUp,
  Mail,
  Check,
  Shield,
  Star,
  Zap,
  Crown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/context/AuthContext';
import { usuarioService } from '@/services/usuario/UsuarioService';
import ProtectedRoute from '@/components/context/ProtectedRoute';
import { usePessoa } from '@/hooks/usePessoa';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { usuarioAreaService, UsuarioArea } from '@/services/usuarioarea/UsuarioAreaService';
import { areaService } from '@/services/area/AreaService';
import { areaSubService } from '@/services/areasub/AreaSubService';
import { Area } from '@/types/area';
import { AreaSub } from '@/types/areasub';
import AreaSelectionAccordion from '@/app/home/components/AreaSelectionAccordion';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PaginaPerfil() {
  const { usuario, authResolved } = useAuthContext();
  const { pessoa, setPessoa, loading } = usePessoa();
  const [sidebarTab, setSidebarTab] = useState<'perfil' | 'editar' | 'areas' | 'senha'>('perfil');
  const [form, setForm] = useState<Partial<Pessoa>>({});
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [previewCapa, setPreviewCapa] = useState<string | null>(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [usuarioAreas, setUsuarioAreas] = useState<UsuarioArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  const [areas, setAreas] = useState<Area[]>([]);
  const [subareas, setSubareas] = useState<AreaSub[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | undefined>();
  const [selectedSubareaId, setSelectedSubareaId] = useState<number | undefined>();
  const [loadingAreasData, setLoadingAreasData] = useState(false);
  const [savingAreas, setSavingAreas] = useState(false);

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

  useEffect(() => {
    async function loadAreas() {
      if (authResolved && usuario) {
        try {
          setLoadingAreas(true);
          const areas = await usuarioAreaService.listarMinhasAreas();
          setUsuarioAreas(areas);
        } catch (error) {
          console.error('Erro ao carregar áreas do usuário:', error);
        } finally {
          setLoadingAreas(false);
        }
      }
    }
    loadAreas();
  }, [authResolved, usuario]);

  useEffect(() => {
    async function loadAreasData() {
      try {
        setLoadingAreasData(true);
        const [areasData, subareasData] = await Promise.all([
          areaService.listAll(),
          areaSubService.listAll(),
        ]);
        setAreas(areasData);
        setSubareas(subareasData);
      } catch (error) {
        console.error('Erro ao carregar áreas disponíveis:', error);
        FormNotification.error({
          message: 'Erro ao carregar áreas disponíveis',
          duration: 3000,
        });
      } finally {
        setLoadingAreasData(false);
      }
    }
    loadAreasData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      FormNotification.error({
        message: '📸 Por favor, selecione apenas arquivos de imagem.',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setPreviewImagem(dataUrl);
        const base64Data = dataUrl.split(',')[1];
        setForm((prev) => ({ ...prev, pesImagemperfil: base64Data }));
        FormNotification.success({
          message: '✨ Imagem de perfil selecionada com sucesso!',
          duration: 2000,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCapaUpload = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      FormNotification.error({
        message: '📸 Por favor, selecione apenas arquivos de imagem.',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setPreviewCapa(dataUrl);
        const base64Data = dataUrl.split(',')[1];
        setForm((prev) => ({ ...prev, pesImagemCapaPerfil: base64Data }));
        FormNotification.success({
          message: '✨ Imagem de capa selecionada com sucesso!',
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
          message: '⚠️ Preencha nome e apelido.',
          duration: 4000,
        });
        return;
      }

      FormNotification.info({
        message: '📤 Salvando suas informações...',
        duration: 2000,
      });

      const formComUsuario = {
        ...form,
        usuId: usuario?.usuId ?? pessoa?.usuId,
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
        message: '🎉 Perfil salvo com sucesso!',
        duration: 4000,
      });

      if (form.pesImagemperfil && !form.pesImagemperfil.startsWith('storage/')) {
        if (pessoaAtualizada.pesImagemperfil) {
          setPreviewImagem(
            `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
              pessoaAtualizada.pesImagemperfil,
            )}`,
          );
        }
      }

      if (form.pesImagemCapaPerfil && !form.pesImagemCapaPerfil.startsWith('storage/')) {
        if (pessoaAtualizada.pesImagemCapaPerfil) {
          setPreviewCapa(
            `${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${usuario?.usuId}/${getFileName(
              pessoaAtualizada.pesImagemCapaPerfil,
            )}`,
          );
        }
      }

      setSidebarTab('perfil');
    } catch (error) {
      FormNotification.error({
        message: '❌ Erro ao salvar perfil. Tente novamente.',
        duration: 4000,
      });
    }
  };

  const handleSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      FormNotification.error({
        message: '⚠️ Preencha todos os campos.',
        duration: 4000,
      });
      return;
    }
    if (novaSenha !== confirmaSenha) {
      FormNotification.error({
        message: '❌ As senhas não coincidem.',
        duration: 4000,
      });
      return;
    }
    setLoadingSenha(true);
    try {
      if (!usuario?.usuId) throw new Error('Usuário não identificado');
      await usuarioService.alterarSenha(usuario.usuId, novaSenha);
      FormNotification.success({
        message: '🔐 Senha alterada com sucesso!',
        duration: 4000,
      });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaSenha('');
      setSidebarTab('perfil');
    } catch (error) {
      FormNotification.error({
        message: '❌ Erro ao alterar senha.',
        duration: 4000,
      });
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleSelectArea = (areaId: number) => {
    if (selectedAreaId === areaId) {
      setSelectedAreaId(undefined);
      setSelectedSubareaId(undefined);
    } else {
      setSelectedAreaId(areaId);
      setSelectedSubareaId(undefined);
    }
  };

  const handleSelectSubarea = (subareaId: number) => {
    setSelectedSubareaId(subareaId);
  };

  const handleSaveAreas = async () => {
    try {
      setSavingAreas(true);

      if (!selectedAreaId) {
        FormNotification.warning({
          message: '⚠️ Por favor, selecione uma área.',
          duration: 3000,
        });
        return;
      }

      if (usuarioAreas.length > 0) {
        await usuarioAreaService.desvincularTodasAreas();
      }

      await usuarioAreaService.vincularArea(selectedAreaId, selectedSubareaId);

      const areasAtualizadas = await usuarioAreaService.listarMinhasAreas();
      setUsuarioAreas(areasAtualizadas);

      FormNotification.success({
        message: '🎯 Áreas atualizadas com sucesso!',
        duration: 3000,
      });

      setSelectedAreaId(undefined);
      setSelectedSubareaId(undefined);
      setSidebarTab('perfil');
    } catch (error) {
      console.error('Erro ao salvar áreas:', error);
      FormNotification.error({
        message: '❌ Erro ao salvar áreas. Tente novamente.',
        duration: 3000,
      });
    } finally {
      setSavingAreas(false);
    }
  };

  const handleRemoveArea = async (usuareaId: number) => {
    try {
      await usuarioAreaService.desvincularArea(usuareaId);
      const areasAtualizadas = await usuarioAreaService.listarMinhasAreas();
      setUsuarioAreas(areasAtualizadas);
      FormNotification.success({
        message: '✅ Área removida com sucesso!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao remover área:', error);
      FormNotification.error({
        message: '❌ Erro ao remover área. Tente novamente.',
        duration: 3000,
      });
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header com animação */}
          <div className="mb-8 sm:mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Meu Perfil
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* Tabs de navegação */}
          <div className="mb-6 sm:mb-8 opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { id: 'perfil', icon: User, label: 'Perfil' },
                { id: 'editar', icon: Edit3, label: 'Editar' },
                { id: 'areas', icon: BookOpen, label: 'Áreas' },
                { id: 'senha', icon: KeyRound, label: 'Senha' },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 ${
                      sidebarTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_forwards]">
            {sidebarTab === 'perfil' &&
              (pessoa && usuario ? (
                <div className="space-y-6">
                  {/* Banner do perfil - Estilo Instagram */}
                  <Card className="overflow-hidden dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                    {/* Imagem de Capa */}
                    <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
                      {pessoa.pesImagemCapaPerfil ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                            usuario?.usuId
                          }/${getFileName(pessoa.pesImagemCapaPerfil)}`}
                          alt="Capa"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900" />
                      )}
                    </div>

                    {/* Avatar sobrepondo a capa */}
                    <div className="relative px-6 sm:px-8">
                      <div className="flex flex-col items-center -mt-16 sm:-mt-20">
                        <div className="relative">
                          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-2xl">
                            {pessoa.pesImagemperfil ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/api/arquivo/view/${
                                  usuario?.usuId
                                }/${getFileName(pessoa.pesImagemperfil)}`}
                                alt="Foto de perfil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>
                          {/* Badge Crown */}
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2.5 shadow-lg ring-4 ring-white dark:ring-gray-800">
                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>

                        {/* Nome e Apelido */}
                        <div className="text-center mt-4 mb-6">
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {pessoa.pesNome}
                          </h2>
                          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                            @{pessoa.pesApelido}
                          </p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 pt-0">
                      {/* Cards de estatísticas */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-purple-600 text-white">
                              <Star className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Nível</p>
                              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {pessoa.pesNivel ?? 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-blue-600 text-white">
                              <Zap className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">XP</p>
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {pessoa.pesXp ?? 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-green-600 text-white">
                              <Shield className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {usuario.usuAtivo ? 'Ativo' : 'Inativo'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações pessoais */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Dados Pessoais
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Nascimento
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {pessoa.pesDatanascimento
                                    ? new Date(
                                        pessoa.pesDatanascimento + 'T00:00:00',
                                      ).toLocaleDateString('pt-BR')
                                    : 'Não informado'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Phone className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Telefone</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {pessoa.pesTelefone1 || 'Não informado'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Contato
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <AtSign className="w-5 h-5 text-gray-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {usuario.usuEmail}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Membro desde
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {usuario.usuDataCadastro
                                    ? new Date(usuario.usuDataCadastro).toLocaleDateString('pt-BR')
                                    : 'Não informado'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Áreas de interesse */}
                      {!loadingAreas && usuarioAreas.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Áreas de Interesse
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {usuarioAreas.map((ua) => (
                              <div
                                key={ua.usuareaId}
                                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                              >
                                <div className="flex items-start gap-3">
                                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                                  <div>
                                    {ua.area && (
                                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {ua.area.areaDescricao}
                                      </p>
                                    )}
                                    {ua.areaSub && (
                                      <p className="text-sm text-purple-700 dark:text-purple-300">
                                        {ua.areaSub.areasDescricao}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!loadingAreas && usuarioAreas.length === 0 && (
                        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-6 text-center">
                          <AlertTriangle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                            Nenhuma área vinculada
                          </h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Complete um teste vocacional para descobrir as melhores áreas para você!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Dados não disponíveis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Não foi possível carregar os dados do perfil.
                    </p>
                  </CardContent>
                </Card>
              ))}

            {sidebarTab === 'editar' && (
              <form onSubmit={handleSubmit}>
                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      Editar Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Imagens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-purple-600" />
                          Imagens do Perfil
                        </h3>
                        {previewImagem && (
                          <img
                            src={previewImagem}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-200 dark:border-purple-800"
                          />
                        )}
                        <FileField
                          label="Foto de Perfil"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                        />
                        {previewCapa && (
                          <img
                            src={previewCapa}
                            alt="Preview capa"
                            className="w-full h-32 rounded-lg object-cover border-2 border-blue-200 dark:border-blue-800"
                          />
                        )}
                        <FileField
                          label="Imagem de Capa"
                          accept="image/*"
                          onChange={(e) => handleCapaUpload(e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <User className="w-5 h-5 text-green-600" />
                          Dados Pessoais
                        </h3>
                        <TextField
                          label="Nome Completo"
                          name="pesNome"
                          value={form.pesNome ?? ''}
                          onChange={handleChange}
                          required
                          icon={User}
                        />
                        <TextField
                          label="Apelido"
                          name="pesApelido"
                          value={form.pesApelido ?? ''}
                          onChange={handleChange}
                          required
                          icon={Tag}
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
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSidebarTab('perfil');
                          setForm(pessoa ?? {});
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        <Check className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            )}

            {sidebarTab === 'areas' && (
              <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Gerenciar Áreas de Interesse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {usuarioAreas.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Suas Áreas Atuais
                      </h3>
                      <div className="space-y-3">
                        {usuarioAreas.map((ua) => (
                          <div
                            key={ua.usuareaId}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              {ua.area && (
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {ua.area.areaDescricao}
                                </p>
                              )}
                              {ua.areaSub && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {ua.areaSub.areasDescricao}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveArea(ua.usuareaId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      Adicionar Nova Área
                    </h3>
                    {loadingAreasData ? (
                      <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                        <p className="mt-3 text-gray-600 dark:text-gray-400">Carregando áreas...</p>
                      </div>
                    ) : (
                      <>
                        <AreaSelectionAccordion
                          areas={areas}
                          subareas={subareas}
                          onSelectArea={handleSelectArea}
                          onSelectSubarea={handleSelectSubarea}
                          selectedAreaId={selectedAreaId}
                          selectedSubareaId={selectedSubareaId}
                        />
                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedAreaId(undefined);
                              setSelectedSubareaId(undefined);
                              setSidebarTab('perfil');
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSaveAreas}
                            disabled={!selectedAreaId || savingAreas}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {savingAreas ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Área
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {sidebarTab === 'senha' && (
              <form onSubmit={handleSenha}>
                <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyRound className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      Alterar Senha
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                            Dicas de segurança
                          </h4>
                          <p className="text-xs text-yellow-700 dark:text-yellow-400">
                            Use letras maiúsculas e minúsculas, números e símbolos. Nunca
                            compartilhe sua senha.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-2xl">
                      <PasswordField
                        label="Senha Atual"
                        name="senhaAtual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        required
                        icon={KeyRound}
                      />
                      <PasswordField
                        label="Nova Senha"
                        name="novaSenha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                      />
                      <PasswordField
                        label="Confirmar Nova Senha"
                        name="confirmaSenha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                        icon={KeyRound}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSidebarTab('perfil');
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmaSenha('');
                        }}
                        disabled={loadingSenha}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={loadingSenha}
                      >
                        {loadingSenha ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4 mr-2" />
                            Alterar Senha
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
