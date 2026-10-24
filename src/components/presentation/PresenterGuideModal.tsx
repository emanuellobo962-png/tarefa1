import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Lightbulb, 
  Eye, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Volume2, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Lock,
  Database,
  Copy,
  Check
} from 'lucide-react';

export const PresenterGuideModal: React.FC = () => {
  const { 
    isPresenterModalOpen, 
    setIsPresenterModalOpen, 
    ihcMode, 
    setIhcMode, 
    resetDemo 
  } = useBank();

  const [activeTab, setActiveTab] = useState<'roteiro' | 'falhas' | 'heurísticas' | 'supabase'>('roteiro');
  const [copiedMigration, setCopiedMigration] = useState<string | null>(null);

  if (!isPresenterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Guia Didático do Apresentador | IHC</h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                    Uso Acadêmico
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                    PostgreSQL Cloud SQL • Migrations OK
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">Banco Horizonte: Estudo de Caso de Usabilidade e Comunicação</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPresenterModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="px-5 py-3 bg-slate-800/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Modo Atual do Protótipo:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-700">
              <button
                onClick={() => setIhcMode('flawed')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  ihcMode === 'flawed'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Com Falhas de IHC (Padrão)
              </button>
              <button
                onClick={() => setIhcMode('improved')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  ihcMode === 'improved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Versão Corrigida (Boas Práticas)
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              resetDemo();
              setIsPresenterModalOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Reiniciar Dados da Demo
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-6 text-sm font-medium bg-slate-900/50">
          <button
            onClick={() => setActiveTab('roteiro')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'roteiro'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            1. Roteiro da Aula (5 Etapas)
          </button>
          <button
            onClick={() => setActiveTab('falhas')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'falhas'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            2. Falhas Intencionais no Protótipo
          </button>
          <button
            onClick={() => setActiveTab('heurísticas')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'heurísticas'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            3. Heurísticas & Conceitos Teóricos
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            4. Supabase & Migrations
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed max-h-[58vh]">
          {activeTab === 'roteiro' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
                <p className="font-semibold text-blue-100 mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  Como conduzir a dinâmica com a turma:
                </p>
                <p className="text-xs text-blue-300/90">
                  O Banco Horizonte foi arquitetado para parecer um banco digital legítimo e moderno. Os problemas não são visuais amadores, mas sim falhas estruturais de comunicação, visibilidade e prevenção de erros.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    Desafio Inicial para a Turma
                  </div>
                  <p className="text-xs text-slate-300 pl-8">
                    Peça a um voluntário ou à turma: <em>"A Ana precisa transferir urgentemente R$ 50,00 via Pix para o colega Carlos Eduardo. Onde ela clica?"</em>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">2</span>
                    A Dificuldade Enfrentada
                  </div>
                  <p className="text-xs text-slate-300 pl-8">
                    O Pix <strong>não está em destaque</strong> no carrossel superior (onde estão termos vagos como "Serviços", "Operações" e botões sem nome). Para achar o Pix, o usuário tem que adivinhar o agrupamento ou procurar em "Operações".
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">3</span>
                    O Clímax: Falha de Feedback (Golfo de Avaliação)
                  </div>
                  <p className="text-xs text-slate-300 pl-8">
                    Ao preencher os dados do Pix e clicar no botão ambíguo "Processar Ordem", o formulário <strong>simplesmente fecha e volta à tela inicial sem emitir aviso, som ou comprovante</strong>. Pergunte à turma: <em>"O Pix foi enviado? Devo clicar de novo e correr o risco de pagar duas vezes?"</em>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">4</span>
                    Discussão Teórica de IHC
                  </div>
                  <p className="text-xs text-slate-300 pl-8">
                    Ao olhar o Extrato, a turma verá que o saldo caiu para R$ 1.200,00 e a operação foi registrada. Isso demonstra a <strong>diferença entre um sistema tecnicamente funcional e um sistema usável</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">5</span>
                    Demonstração da Solução (Versão Corrigida)
                  </div>
                  <p className="text-xs text-slate-300 pl-8">
                    Ative a opção <strong>"Versão Corrigida"</strong> no topo deste guia. Mostre como o Pix passa a ter destaque prioritário, nomes claros, tela de revisão obrigatória com confirmação e um comprovante bancário legível com feedback visual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'falhas' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <Eye className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Visibilidade Inadequada</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    A operação mais comum do usuário brasileiro (Pix) é tratada com peso menor do que produtos comerciais como "Consórcio" ou escondida sob "Operações".
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Mapeamento e Rótulos Ambíguos</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Uso de terminologia vaga ("Serviços", "Outros", "Processar Ordem", "Submeter") em vez de verbos de ação orientados ao usuário ("Pagar conta", "Fazer Pix", "Transferir").
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Ausência de Feedback (Golfo de Avaliação)</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Após enviar o Pix no modo com falhas, o app não exibe toast de sucesso, tela de confirmação nem comprovante. O usuário fica desorientado sobre o sucesso ou falha da transação.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Falta de Prevenção de Erros (Nielsen #5)</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Não existe tela de conferência dos dados do destinatário no Pix. Além disso, no <strong>CRUD de Favorecidos</strong>, a exclusão apaga o contato instantaneamente sem pedir confirmação do usuário no Modo Falhas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Autenticação & Login (Nielsen #1 e #9)</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    No login com Gmail e senha do Modo Falhas: ausência do ícone de olho para checar a senha digitada, sem detecção de <strong>Caps Lock</strong> ligado, e erro críptico de máquina que apaga tudo (<em>ERRO_401_AUTH_HASH</em>). Na Versão Corrigida: botão para exibir senha, alerta de Caps Lock e mensagens construtivas de recuperação.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <SlidersHorizontal className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">CRUD & Gestão de Dados (Formulários Antiergonômicos)</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    No formulário do CRUD com falhas, os botões "Gravar Objeto" e "Abortar" possuem pesos visuais idênticos e rótulos burocráticos ("Entidade Receptora", "String de Indexação"). Na Versão Corrigida, há validação guiada, confirmação antes de deletar e botão de destaque.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <Layers className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Problemas de Acessibilidade & Contraste</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ícones secundários sem legendas acessíveis, textos auxiliares com tamanho inferior a 11px e contraste fraco em elementos secundários.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'heurísticas' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Conceito 1: O Modelo Mental vs. O Modelo do Sistema (Don Norman)
                </h4>
                <p className="text-xs text-slate-300">
                  O modelo mental do correntista moderno espera que o Pix seja a primeira ação rápida do banco. Quando o arquiteto do sistema organiza as funções pelo jargão da contabilidade bancária ("Operações de Liquidação"), ocorre uma ruptura cognitiva.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Conceito 2: O Golfo de Avaliação (Gulf of Evaluation)
                </h4>
                <p className="text-xs text-slate-300">
                  Mede a dificuldade que o usuário tem para interpretar o estado físico do sistema e determinar se seus objetivos foram atingidos. Quando o Banco Horizonte fecha o formulário sem comprovante, o Golfo de Avaliação é máximo: o usuário precisa adivinhar o resultado checando seu saldo manualmente.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Conceito 3: Heurística #5 de Nielsen - Prevenção de Erros
                </h4>
                <p className="text-xs text-slate-300">
                  Melhor que boas mensagens de erro é um design cuidadoso que evita que o problema aconteça. Em transações financeiras irreversíveis como o Pix, uma etapa de revisão prévia ("Confirma os dados abaixo?") é mandatória na boa IHC.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-6">
              {/* Architecture Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h3 className="font-bold text-white text-base">Integração Supabase & Cloud SQL (PostgreSQL 15+)</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      O Banco Horizonte conta com persistência relacional completa e migrations padronizadas para PostgreSQL e Supabase.
                      Suporta tanto execução remota via Cloud SQL quanto instâncias locais ou gerenciadas Supabase.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] shrink-0">
                    3 Migrations Ativas
                  </span>
                </div>
              </div>

              {/* Status and Environment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">Banco de Dados</p>
                  <p className="text-sm font-bold text-white mt-1">PostgreSQL 15</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Cloud SQL & Supabase Ready</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">Segurança (RLS)</p>
                  <p className="text-sm font-bold text-white mt-1">Row Level Security</p>
                  <p className="text-[10px] text-cyan-400 mt-0.5">Políticas por UID / Auth</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">SDK Client</p>
                  <p className="text-sm font-bold text-white mt-1">@supabase/supabase-js</p>
                  <p className="text-[10px] text-blue-400 mt-0.5">Tipado via types/supabase.ts</p>
                </div>
              </div>

              {/* Generated Migrations List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Arquivos de Migration em /supabase/migrations/</span>
                  <span className="text-[11px] font-normal text-slate-500">Compatível com Supabase CLI e Drizzle</span>
                </h4>

                {/* Migration 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-semibold">001</span>
                      <span className="text-sm font-semibold text-white">20261017000001_initial_schema.sql</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Tabelas & Índices</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Cria tabelas <code className="text-cyan-300 font-mono">public.users</code>, <code className="text-cyan-300 font-mono">public.transactions</code>, <code className="text-cyan-300 font-mono">public.contacts</code> (CRUD de favorecidos) e <code className="text-cyan-300 font-mono">public.user_pix_keys</code> (CRUD de chaves).
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-24">
                    <code>{`CREATE TABLE public.users (...); CREATE TABLE public.transactions (...); CREATE TABLE public.contacts (...); CREATE TABLE public.user_pix_keys (...);`}</code>
                  </div>
                </div>

                {/* Migration 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-semibold">002</span>
                      <span className="text-sm font-semibold text-white">20261017000002_rls_policies.sql</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Segurança Multi-tenant</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Ativa Row Level Security (RLS) e define políticas granulares de leitura e escrita baseadas no <code className="text-emerald-300 font-mono">auth.uid()</code> do Supabase / Firebase.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-24">
                    <code>{`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (...);`}</code>
                  </div>
                </div>

                {/* Migration 3 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono font-semibold">003</span>
                      <span className="text-sm font-semibold text-white">20261017000003_seed_banco_horizonte.sql</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">Carga Inicial Didática</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Povoa a base com a conta de <strong>Ana Carolina Silva</strong> (Saldo R$ 1.250,00), 5 transações bancárias verossímeis, 4 contatos favoritos e 3 chaves Pix cadastradas.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-24">
                    <code>{`INSERT INTO public.users (uid, email, name, balance) VALUES ('ana-silva-uid', 'ana.silva@gmail.com', 'Ana Carolina Silva', 1250.00);`}</code>
                  </div>
                </div>
              </div>

              {/* Developer Configuration Guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Como usar em seu projeto Supabase próprio:
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>No painel do Supabase, acesse <strong>SQL Editor</strong> ou use a CLI: <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">npx supabase db push</code>.</li>
                  <li>Execute os arquivos em ordem numérica a partir da pasta <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">/supabase/migrations/</code>.</li>
                  <li>Adicione sua URL e Anon Key no <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">.env</code>: <code className="text-slate-400 font-mono">VITE_SUPABASE_URL</code> e <code className="text-slate-400 font-mono">VITE_SUPABASE_ANON_KEY</code>.</li>
                  <li>O serviço <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">src/services/supabaseService.ts</code> e o cliente <code className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">src/lib/supabase.ts</code> conectam diretamente mantendo o protótipo sincronizado.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Dica: você pode abrir ou fechar este painel a qualquer momento pelo botão discreto <strong>Painel IHC</strong> no cabeçalho.
          </span>
          <button
            onClick={() => setIsPresenterModalOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Continuar Apresentação
          </button>
        </div>
      </div>
    </div>
  );
};
