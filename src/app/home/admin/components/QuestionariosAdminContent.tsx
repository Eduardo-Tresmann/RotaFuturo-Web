import { FormNotification } from '@/components/ui/form-components/form-notification';


import React, { useState, useEffect } from 'react';
import { AdminPageContent } from '@/components/admin/AdminPageContent';
import { QuestionarioTable } from './QuestionarioTable';
import { QuestaoTable } from './QuestaoTable';
import { AlternativaTable } from './AlternativaTable';
import { QuestionarioTipoTable } from './QuestionarioTipoTable';
import { QuestaoTipoTable } from './QuestaoTipoTable';
import { QuestaoNivelTable } from './QuestaoNivelTable';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { questionarioService } from '@/services/questionario/QuestionarioService';
import { questaoService } from '@/services/questao/QuestaoService';
import { questionarioTipoService } from '@/services/questionario/QuestionarioTipoService';
import { questaoTipoService } from '@/services/questao/QuestaoTipoService';
import { questaoNivelService } from '@/services/questao/QuestaoNivelService';
import { questaoAlternativaService } from '@/services/questao/QuestaoAlternativaService';

import QuestaoTipoForm from './QuestaoTipoForm';
import QuestaoNivelForm from './QuestaoNivelForm';
import QuestaoAlternativaForm from './QuestaoAlternativaForm';
import QuestionarioTipoForm from './QuestionarioTipoForm';
import QuestaoForm from './QuestaoForm';
import QuestionarioForm from './QuestionarioForm';




type TabKey = 'questionarios' | 'questoes' | 'tiposQuestionario' | 'tiposQuestao' | 'niveisQuestao' | 'alternativas';
interface ModalState { tipo: string; data?: any };
interface Filtros {
  [key: string]: { [key: string]: string };
  questionarios: { descricao: string; ativo: string };
  questoes: { descricao: string; ativo: string };
  tiposQuestionario: { descricao: string; ativo: string };
  tiposQuestao: { descricao: string; ativo: string };
  niveisQuestao: { descricao: string; ativo: string };
  alternativas: { descricao: string; correta: string };
}

export function QuestionariosAdminContent() {
  const [tab, setTab] = useState<TabKey>('questionarios');
  const [questionarios, setQuestionarios] = useState<any[]>([]);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [tiposQuestionario, setTiposQuestionario] = useState<any[]>([]);
  const [tiposQuestao, setTiposQuestao] = useState<any[]>([]);
  const [niveisQuestao, setNiveisQuestao] = useState<any[]>([]);
  const [alternativas, setAlternativas] = useState<any[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    questionarios: { descricao: '', ativo: '' },
    questoes: { descricao: '', ativo: '' },
    tiposQuestionario: { descricao: '', ativo: '' },
    tiposQuestao: { descricao: '', ativo: '' },
    niveisQuestao: { descricao: '', ativo: '' },
    alternativas: { descricao: '', correta: '' },
  });
  const [showFiltro, setShowFiltro] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);

  // Funções para atualizar cada lista
  async function refreshQuestionarios() {
    setQuestionarios(await questionarioService.listAll());
  }
  async function refreshQuestoes() { setQuestoes(await questaoService.listAll()); }
  async function refreshTiposQuestionario() {
    const tipos = await questionarioTipoService.listAll();
    setTiposQuestionario(
      tipos.map((t: any) => ({
        id: t.questId,
        descricao: t.questDescricao,
        ativo: t.questAtivo,
        ...t,
      }))
    );
  }
  async function refreshTiposQuestao() {
    const tipos = await questaoTipoService.listAll();
    setTiposQuestao(
      tipos.map((t: any) => ({
        id: t.quetId,
        descricao: t.quetDescricao,
        ativo: t.quetAtivo,
        ...t,
      }))
    );
  }
  async function refreshNiveisQuestao() { setNiveisQuestao(await questaoNivelService.listAll()); }
  async function refreshAlternativas() { setAlternativas(await questaoAlternativaService.listAll()); }

  useEffect(() => {
    refreshQuestionarios();
    refreshQuestoes();
    refreshTiposQuestionario();
    refreshTiposQuestao();
    refreshNiveisQuestao();
    refreshAlternativas();
  }, []);

  return (
    <AdminPageContent
      actionButtons={[
  <button key="inserir-questionario" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-questionario' })}>Inserir Questionário</button>,
  <button key="inserir-questao" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-questao' })}>Inserir Questão</button>,
  <button key="inserir-tipo-questionario" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-tipo-questionario' })}>Inserir Tipo de Questionário</button>,
  <button key="inserir-tipo-questao" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-tipo-questao' })}>Inserir Tipo de Questão</button>,
  <button key="inserir-nivel-questao" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-nivel-questao' })}>Inserir Nível de Questão</button>,
  <button key="inserir-alternativa" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setModal({ tipo: 'inserir-alternativa' })}>Inserir Alternativa</button>,
      ]}
      tabs={[
        { label: 'Questionários', value: 'questionarios' },
        { label: 'Questões', value: 'questoes' },
        { label: 'Tipos de Questionário', value: 'tiposQuestionario' },
        { label: 'Tipos de Questão', value: 'tiposQuestao' },
        { label: 'Níveis de Questão', value: 'niveisQuestao' },
        { label: 'Alternativas', value: 'alternativas' },
      ]}
      currentTab={tab}
  onTabChange={(tab) => setTab(tab as 'questionarios' | 'questoes' | 'tiposQuestionario' | 'tiposQuestao' | 'niveisQuestao' | 'alternativas')}
      filterButton={
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors bg-zinc-800 text-white hover:bg-zinc-700 ${Object.values(filtros[tab]).some(v => v) ? 'ring-2 ring-blue-500 text-blue-500 bg-white hover:bg-zinc-100 border border-blue-500' : ''}`}
          onClick={() => setShowFiltro(true)}
          style={{ minWidth: 120 }}
        >
          <Filter size={18} className={Object.values(filtros[tab]).some(v => v) ? 'text-blue-500' : ''} />
          Filtro
        </button>
      }
      filterModal={
        <Dialog open={showFiltro} onOpenChange={setShowFiltro}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtro</DialogTitle>
            </DialogHeader>
            {/* Filtros dinâmicos por aba */}
            <form className="flex flex-col gap-4 py-2" onSubmit={e => { e.preventDefault(); setShowFiltro(false); }}>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700">Descrição</span>
                <input type="text" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Buscar por descrição..." value={filtros[tab].descricao || ''} onChange={e => setFiltros(f => ({ ...f, [tab]: { ...f[tab], descricao: e.target.value } }))} />
              </label>
              {'correta' in filtros[tab] && (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700">Correta?</span>
                  <select className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" value={typeof filtros[tab].correta === 'string' ? filtros[tab].correta : ''} onChange={e => setFiltros(f => ({ ...f, [tab]: { ...f[tab], correta: e.target.value } }))}>
                    <option value="">Todas</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </label>
              )}
              {'ativo' in filtros[tab] && (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-700">Ativo</span>
                  <select className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" value={typeof filtros[tab].ativo === 'string' ? filtros[tab].ativo : ''} onChange={e => setFiltros(f => ({ ...f, [tab]: { ...f[tab], ativo: e.target.value } }))}>
                    <option value="">Todos</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium" onClick={() => setFiltros(f => ({ ...f, [tab]: Object.fromEntries(Object.keys(f[tab]).map(k => [k, ''])) }))}>Limpar filtros</button>
                <button type="button" className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 border border-zinc-300" onClick={() => setShowFiltro(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700">Filtrar</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {tab === 'questionarios' && (
        <QuestionarioTable
          questionarios={questionarios}
          onEdit={q => setModal({ tipo: 'editar-questionario', data: q })}
          onInativar={async (q) => {
            const { success, error } = FormNotification;
            try {
              const novoStatus = !q.quesAtivo;
              await questionarioService.update(q.quesId, {
                quesDescricao: q.quesDescricao,
                quesAtivo: novoStatus,
                questionarioTipo: q.questionarioTipo?.questId ? { questId: q.questionarioTipo.questId } : undefined
              });
              setQuestionarios(prev => prev.map(item => item.quesId === q.quesId ? { ...item, quesAtivo: novoStatus } : item));
              success({ message: `Questionário ${novoStatus ? 'ativado' : 'inativado'} com sucesso!` });
            } catch (err: any) {
              error({ message: err?.message || 'Erro ao atualizar questionário!' });
            }
          }}
        />
      )}
      {tab === 'questoes' && (
        <QuestaoTable
          questoes={questoes}
          onEdit={q => setModal({ tipo: 'editar-questao', data: q })}
          onInativar={q => setModal({ tipo: 'inativar-questao', data: q })}
        />
      )}
      {tab === 'tiposQuestionario' && (
        <QuestionarioTipoTable
          tipos={tiposQuestionario}
          onEdit={t => setModal({ tipo: 'editar-tipo-questionario', data: t })}
          setTipos={setTiposQuestionario}
        />
      )}
      {tab === 'tiposQuestao' && (
        <QuestaoTipoTable
          tipos={tiposQuestao}
          onEdit={t => setModal({ tipo: 'editar-tipo-questao', data: {
            quetId: t.id,
            quetDescricao: t.descricao,
            quetAtivo: t.ativo
          } })}
          setTipos={setTiposQuestao}
        />
      )}
      {tab === 'niveisQuestao' && (
        <QuestaoNivelTable
          niveis={niveisQuestao}
          onEdit={n => setModal({ tipo: 'editar-nivel-questao', data: n })}
          onInativar={async (nivel) => {
            const { success, error } = FormNotification;
            try {
              const novoStatus = !nivel.quesnAtivo;
              // Sempre envie a descrição junto com o status
              await questaoNivelService.update(nivel.quesnId, { quesnDescricao: nivel.quesnDescricao, quesnAtivo: novoStatus });
              setNiveisQuestao(prev => prev.map(n => n.quesnId === nivel.quesnId ? { ...n, quesnAtivo: novoStatus } : n));
              success({ message: `Nível ${novoStatus ? 'ativado' : 'inativado'} com sucesso!` });
            } catch (err: any) {
              error({ message: err?.message || 'Erro ao atualizar nível!' });
            }
          }}
        />
      )}
      {tab === 'alternativas' && (
        <AlternativaTable
          alternativas={alternativas}
          onEdit={a => setModal({ tipo: 'editar-alternativa', data: a })}
          onInativar={a => setModal({ tipo: 'inativar-alternativa', data: a })}
        />
      )}
      {/* Modal de cadastro/edição e confirmação */}
      <Dialog open={!!modal} onOpenChange={v => !v && setModal(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{modal?.tipo ? modal.tipo.replace('-', ' ').toUpperCase() : ''}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <span className="sr-only" id="modal-desc">Formulário de cadastro e edição</span>
            {modal?.tipo === 'inserir-questionario' ? (
              <QuestionarioForm onSuccess={() => { setModal(null); refreshQuestionarios(); }} />
            ) : modal?.tipo === 'editar-questionario' ? (
              <QuestionarioForm onSuccess={() => { setModal(null); refreshQuestionarios(); }} data={modal?.data} />
            ) : modal?.tipo === 'inserir-tipo-questionario' ? (
              <QuestionarioTipoForm onSuccess={() => { setModal(null); refreshTiposQuestionario(); }} />
            ) : modal?.tipo === 'editar-tipo-questionario' ? (
              <QuestionarioTipoForm onSuccess={() => { setModal(null); refreshTiposQuestionario(); }} data={modal?.data} />
            ) : modal?.tipo === 'inserir-tipo-questao' ? (
              <QuestaoTipoForm onSuccess={() => { setModal(null); refreshTiposQuestao(); }} />
            ) : modal?.tipo === 'editar-tipo-questao' ? (
              <QuestaoTipoForm onSuccess={() => { setModal(null); refreshTiposQuestao(); }} data={modal?.data} />
            ) : modal?.tipo === 'inserir-nivel-questao' ? (
              <QuestaoNivelForm onSuccess={() => { setModal(null); refreshNiveisQuestao(); }} />
            ) : modal?.tipo === 'editar-nivel-questao' ? (
              <QuestaoNivelForm onSuccess={() => { setModal(null); refreshNiveisQuestao(); }} data={modal?.data} />
            ) : modal?.tipo === 'inserir-questao' || modal?.tipo === 'editar-questao' ? (
              <QuestaoForm onSuccess={() => { setModal(null); refreshQuestoes(); }} />
            ) : modal?.tipo === 'inserir-alternativa' ? (
              <QuestaoAlternativaForm onSuccess={() => { setModal(null); refreshAlternativas(); }} />
            ) : modal?.tipo === 'editar-alternativa' ? (
              <QuestaoAlternativaForm onSuccess={() => { setModal(null); refreshAlternativas(); }} data={modal?.data} />
            ) : (
              <div className="text-zinc-500">Selecione uma ação.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </AdminPageContent>
  );
}
