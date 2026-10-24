import React from 'react';
import { useBank } from '../../context/BankContext';
import { 
  Eye, 
  EyeOff, 
  Send, 
  Receipt, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  CreditCard, 
  ChevronRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users,
  Compass,
  Box,
  Tag,
  CircleDot,
  Wifi,
  Sparkles
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    account, 
    transactions, 
    contacts,
    isBalanceVisible, 
    toggleBalanceVisibility, 
    setCurrentView, 
    ihcMode,
    setActiveReceipt,
    session
  } = useBank();

  const isFlawed = ihcMode === 'flawed';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1424] via-[#090e1a] to-[#070b14] border border-slate-800/80 p-6 sm:p-7 shadow-xl">
        {/* Subtle background radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Conta Corrente · Banco Horizonte</span>
            </div>

            <button
              onClick={toggleBalanceVisibility}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              title={isBalanceVisible ? 'Ocultar saldo' : 'Exibir saldo'}
              aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Exibir saldo'}
            >
              {isBalanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1 font-medium">Saldo disponível em conta</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-slate-400">R$</span>
              {isBalanceVisible ? (
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                  {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-slate-500 tracking-widest font-mono">
                  ••••••••
                </span>
              )}
            </div>
          </div>

          {/* Pix Limit Bar */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Limite Pix diário</span>
              <span className="font-semibold text-white font-mono tabular-nums">
                R$ {account.pixLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(15, (account.balance / (account.pixLimit || 5000)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW: Central Showcase of Usability vs Flawed Mapping */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isFlawed ? 'Ações Rápidas' : 'Serviços Principais'}
          </h3>
          {isFlawed && (
            <span className="text-[11px] text-amber-400/90 font-mono">
              * Mapeamento intencionalmente ambíguo (IHC)
            </span>
          )}
        </div>

        {isFlawed ? (
          /* FLAWED MODE:
             - Pix is hidden behind "Operações" with a generic Box icon
             - Vague labels: "Serviços", "Outros", "Operações"
             - Non-essential features pushed to the front
          */
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3">
            <button
              onClick={() => setCurrentView('payments')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Serviços</span>
              <span className="text-[9px] text-slate-500">Boletos</span>
            </button>

            <button
              onClick={() => setCurrentView('pix')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-center group cursor-pointer relative"
              title="Operações de Envio Digital"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Box className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Operações</span>
              <span className="text-[9px] text-slate-500">Envio/Pix</span>
            </button>

            <button
              onClick={() => setCurrentView('transfers')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Outros</span>
              <span className="text-[9px] text-slate-500">TED/DOC</span>
            </button>

            <button
              onClick={() => alert('Módulo de consórcios disponível sob solicitação gerencial.')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Tag className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Consórcios</span>
              <span className="text-[9px] text-slate-500">Crédito</span>
            </button>

            <button
              onClick={() => setCurrentView('contacts')}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-300">Registros</span>
              <span className="text-[9px] text-slate-500">Entidades</span>
            </button>
          </div>
        ) : (
          /* IMPROVED MODE:
             - Pix is prominent with clear branding and immediate visual clarity
             - Recognizable Portuguese verbs (Área Pix, Pagar Boletos, Transferências, etc.)
          */
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => setCurrentView('pix')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-600/40 hover:border-blue-500 hover:bg-blue-900/30 transition-all group cursor-pointer text-left shadow-sm shadow-blue-950/30"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-blue-900/50 group-hover:scale-105 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Área Pix</span>
                  <span className="text-[11px] text-blue-300">Pagar & Receber</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('payments')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Pagar Conta</span>
                  <span className="text-[11px] text-slate-400">Boletos & Contas</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('transfers')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowLeftRight className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Transferir</span>
                  <span className="text-[11px] text-slate-400">TED / DOC</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('contacts')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Favorecidos</span>
                  <span className="text-[11px] text-slate-400">Agenda & Chaves</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('statement')}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Extrato</span>
                  <span className="text-[11px] text-slate-400">Histórico completo</span>
                </div>
              </button>
            </div>

            {/* Quick Contacts Avatar Strip in Improved Mode */}
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Favorecidos recentes:</span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {contacts.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCurrentView('contacts')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-xs text-slate-300 transition-colors cursor-pointer shrink-0"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-950 text-blue-400 font-bold text-[10px] flex items-center justify-center border border-blue-800">
                      {c.name.charAt(0)}
                    </span>
                    <span className="truncate max-w-[100px]">{c.nickname || c.name.split(' ')[0]}</span>
                  </button>
                ))}
                <button
                  onClick={() => setCurrentView('contacts')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-medium border border-blue-500/25 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  + Gerenciar Agenda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Credit Card Showcase */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#101728] via-[#0d1322] to-[#080d18] border border-slate-800/90 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {/* Card Mockup Graphic */}
          <div className="w-16 h-11 rounded-lg bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-700 border border-slate-700/80 p-1.5 flex flex-col justify-between shrink-0 shadow-md">
            <div className="flex items-center justify-between">
              <div className="w-3.5 h-2.5 rounded-xs bg-amber-400/90 border border-amber-500/60"></div>
              <Wifi className="w-2.5 h-2.5 text-white/70 rotate-90" />
            </div>
            <div className="text-[8px] text-white/90 font-mono tracking-widest">
              •••• 4092
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Cartão Horizonte Mastercard Black</p>
              <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Titular: {session.name} · Limite disponível: R$ 12.000,00
            </p>
          </div>
        </div>

        <button 
          onClick={() => setCurrentView('statement')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700/80 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
        >
          Consultar Fatura
        </button>
      </div>

      {/* Recent Transactions List (Extrato Rápido) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Últimas Movimentações
          </h3>
          <button
            onClick={() => setCurrentView('statement')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Ver extrato completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-lg">
          {transactions.slice(0, 5).map((tx) => {
            const isNegative = tx.amount < 0;

            return (
              <div
                key={tx.id}
                onClick={() => setActiveReceipt(tx)}
                className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isNegative
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isNegative ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {tx.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {tx.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <p
                    className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${
                      isNegative ? 'text-white' : 'text-emerald-400'
                    }`}
                  >
                    {isNegative ? '-' : '+'} R${' '}
                    {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tx.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
