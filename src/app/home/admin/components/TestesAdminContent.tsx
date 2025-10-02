import React, { useEffect, useState } from 'react';
import { FormNotification } from '@/components/ui/form-components/form-notification';
import { AdminPageContent } from '@/components/admin/AdminPageContent';
import { TesteTable } from './TesteTable';
import { TesteQuestaoTable } from './TesteQuestaoTable';
import TesteForm from './TesteForm';
import TesteQuestaoForm from './TesteQuestaoForm';
import { Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { testeService, Teste, TesteQuestao } from '@/services/teste/TesteService';
type TabKey = 'testes' | 'questoes' | 'vinculos';
interface ModalState {
  tipo: string;
  data?: any;
}
interface Filtros {
  [key: string]: { [key: string]: string };
  testes: { descricao: string };
  questoes: { descricao: string };
  vinculos: {};
}
export function TestesAdminContent() {
  const [tab, setTab] = useState<TabKey>('testes');
  const [testes, setTestes] = useState<Teste[]>([]);
  const [questoes, setQuestoes] = useState<TesteQuestao[]>([]);
  const [vinculos, setVinculos] = useState<
    Array<{ tesqvId: number; tesId: number; tesqId: number }>
  >([]);
  const [filtros, setFiltros] = useState<Filtros>({
    testes: { descricao: '' },
    questoes: { descricao: '' },
    vinculos: {},
  });
  const [showFiltro, setShowFiltro] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [selectedTesteId, setSelectedTesteId] = useState<number | null>(null);
  async function refreshTestes() {
    setTestes(await testeService.listTestes());
  }
  async function refreshQuestoes() {
    const testes = await testeService.listTestes();
    const questoesArrays = await Promise.all(testes.map((t) => testeService.listQuestoes(t.tesId)));
    setQuestoes(questoesArrays.flat());
  }
  useEffect(() => {
    refreshTestes();
    refreshQuestoes();
  }, []);
  async function handleSaveTeste(data: Partial<Teste>) {
    try {
      if (data.tesId) {
        await testeService.updateTeste(data.tesId, data);
        FormNotification.success({ message: 'Teste editado com sucesso!' });
      } else {
        await testeService.createTeste(data);
        FormNotification.success({ message: 'Teste inserido com sucesso!' });
      }
      setModal(null);
      refreshTestes();
    } catch (err: any) {
      FormNotification.error({ message: err?.message || 'Erro ao salvar teste!' });
    }
  }
  async function handleSaveQuestao(data: Partial<TesteQuestao>) {
    try {
      if (data.tesqId) {
        await testeService.updateTesteQuestao(data.tesqId, data);
        FormNotification.success({ message: 'Questão editada com sucesso!' });
      } else {
        console.log('Creating TesteQuestao:', data);
        const createdQuestao = await testeService.createTesteQuestao(data);
        console.log('Created TesteQuestao:', createdQuestao);
        if (data.testeId && createdQuestao?.tesqId) {
          console.log('Creating TesteQuestaoVinculo with:', {
            testeId: data.testeId,
            questaoId: createdQuestao.tesqId,
          });
        }
      }
      setModal(null);
      refreshQuestoes();
    } catch (err: any) {
      FormNotification.error({ message: err?.message || 'Erro ao salvar questão!' });
    }
  }
  return (
    <AdminPageContent
      actionButtons={[
        <button
          key="inserir-teste"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          onClick={() => setModal({ tipo: 'inserir-teste' })}
        >
          Inserir Teste
        </button>,
        <button
          key="inserir-questao"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          onClick={() => setModal({ tipo: 'inserir-questao' })}
        >
          Inserir Questão
        </button>,
      ]}
      tabs={[
        { label: 'Testes', value: 'testes' },
        { label: 'Questões', value: 'questoes' },
      ]}
      currentTab={tab}
      onTabChange={(tab) => setTab(tab as TabKey)}
      filterButton={
        'descricao' in filtros[tab] && (
          <button
            className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors bg-zinc-800 text-white hover:bg-zinc-700 ${
              filtros[tab].descricao
                ? 'ring-2 ring-blue-500 text-blue-500 bg-white hover:bg-zinc-100 border border-blue-500'
                : ''
            }`}
            onClick={() => setShowFiltro(true)}
            style={{ minWidth: 120 }}
          >
            <Filter size={18} className={filtros[tab].descricao ? 'text-blue-500' : ''} />
            Filtro
          </button>
        )
      }
      filterModal={
        <Dialog open={showFiltro} onOpenChange={setShowFiltro}>
          <DialogContent className="dark:bg-neutral-900 dark:border-neutral-700">
            <DialogHeader>
              <DialogTitle className="dark:text-zinc-100">Filtro</DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-col gap-4 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                setShowFiltro(false);
              }}
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Descrição
                </span>
                <input
                  type="text"
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none dark:bg-neutral-800 dark:text-zinc-100 dark:border-neutral-700"
                  placeholder="Buscar por descrição..."
                  value={
                    'descricao' in filtros[tab] && typeof filtros[tab].descricao === 'string'
                      ? filtros[tab].descricao
                      : ''
                  }
                  onChange={(e) =>
                    setFiltros((f) => ({ ...f, [tab]: { ...f[tab], descricao: e.target.value } }))
                  }
                />
              </label>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  onClick={() => setFiltros((f) => ({ ...f, [tab]: { descricao: '' } }))}
                >
                  Limpar filtros
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300 border border-zinc-300 dark:bg-neutral-800 dark:text-zinc-100 dark:border-neutral-700"
                  onClick={() => setShowFiltro(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Filtrar
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {tab === 'testes' && (
        <TesteTable
          testes={testes.filter((t) =>
            t.tesDescricao.toLowerCase().includes(filtros.testes.descricao.toLowerCase()),
          )}
          onEdit={(t) => setModal({ tipo: 'editar-teste', data: t })}
          onInativar={() => {}}
        />
      )}
      {tab === 'questoes' && (
        <TesteQuestaoTable
          questoes={questoes.filter((q) =>
            q.tesqDescricao.toLowerCase().includes(filtros.questoes.descricao.toLowerCase()),
          )}
          onEdit={(q) => setModal({ tipo: 'editar-questao', data: q })}
          onInativar={() => {}}
        />
      )}
      <Dialog open={!!modal} onOpenChange={(v) => !v && setModal(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {modal?.tipo ? modal.tipo.replace('-', ' ').toUpperCase() : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <span className="sr-only" id="modal-desc">
              Formulário de cadastro e edição
            </span>
            {modal?.tipo === 'inserir-teste' ? (
              <TesteForm onSave={handleSaveTeste} onCancel={() => setModal(null)} />
            ) : modal?.tipo === 'editar-teste' ? (
              <TesteForm
                initial={modal.data}
                onSave={handleSaveTeste}
                onCancel={() => setModal(null)}
              />
            ) : modal?.tipo === 'inserir-questao' ? (
              <TesteQuestaoForm onSave={handleSaveQuestao} onCancel={() => setModal(null)} />
            ) : modal?.tipo === 'editar-questao' ? (
              <TesteQuestaoForm
                initial={modal.data}
                onSave={handleSaveQuestao}
                onCancel={() => setModal(null)}
              />
            ) : (
              <div className="text-zinc-500">Selecione uma ação.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageContent>
  );
}
