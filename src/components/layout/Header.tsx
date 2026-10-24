import React from 'react';
import { useBank } from '../../context/BankContext';
import { 
  RotateCcw, 
  BookOpen, 
  Smartphone, 
  Monitor, 
  SlidersHorizontal,
  Bell,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    account, 
    session,
    logout,
    ihcMode, 
    setIhcMode, 
    resetDemo, 
    setIsPresenterModalOpen, 
    deviceMode, 
    setDeviceMode,
    setCurrentView,
    lastActionNotice
  } = useBank();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-40">
      {/* Top Pedagogical / Academic Controls Bar */}
      <div className="bg-[#0b101d] border-b border-slate-800/60 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Laboratório de IHC • Avaliação de Usabilidade
          </span>

          {/* Segmented Mode Switcher */}
          <div className="inline-flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setIhcMode('improved')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                ihcMode === 'improved'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interface otimizada com as 10 Heurísticas de Nielsen e boas práticas"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Versão Aprimorada</span>
            </button>
            <button
              onClick={() => setIhcMode('flawed')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                ihcMode === 'flawed'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modo com falhas intencionais para comparação e estudo acadêmico"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Falhas IHC</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Viewport switch */}
          <div className="hidden sm:inline-flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                deviceMode === 'desktop' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                deviceMode === 'mobile' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Simulador Celular"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Celular</span>
            </button>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors cursor-pointer"
            title="Restaura saldo e dados de demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Reiniciar Demo</span>
          </button>

          {/* Presenter guide trigger */}
          <button
            onClick={() => setIsPresenterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia Acadêmico IHC</span>
          </button>
        </div>
      </div>

      {/* Main Bank Navigation (Top Bar Contract: 3-Zone Architecture) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark & Horizon Symbol */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-900/40">
            <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute -bottom-2.5 w-7 h-7 rounded-full border border-sky-400/60 bg-blue-900/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-sky-300 shadow-xs shadow-sky-300/80 z-10 -translate-y-0.5"></div>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
                BANCO HORIZONTE
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-400/90 uppercase hidden sm:inline">
                Digital
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Ag. {account.agency} · Conta {account.account}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (When authenticated on wide screens) */}
        {session.isAuthenticated ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button 
              onClick={() => setCurrentView('home')} 
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Visão Geral
            </button>
            <button 
              onClick={() => setCurrentView('pix')} 
              className="hover:text-white transition-colors cursor-pointer text-blue-400 font-semibold whitespace-nowrap"
            >
              Área Pix
            </button>
            <button 
              onClick={() => setCurrentView('payments')} 
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Pagamentos
            </button>
            <button 
              onClick={() => setCurrentView('transfers')} 
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Transferências
            </button>
            <button 
              onClick={() => setCurrentView('statement')} 
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Extrato
            </button>
            <button 
              onClick={() => setCurrentView('contacts')} 
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Favorecidos
            </button>
          </nav>
        ) : (
          <div className="hidden sm:block text-xs text-slate-400">
            Sistema Financeiro Digital Protegido
          </div>
        )}

        {/* Zone 3: Profile & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {session.isAuthenticated ? (
            <>
              {/* User greeting */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {session.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {session.email}
                </p>
              </div>

              {/* Quick Settings Icon */}
              <button 
                onClick={() => setCurrentView('settings')}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Configurações da conta"
                aria-label="Configurações"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Avatar Chip */}
              <button
                onClick={() => setCurrentView('settings')}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-950 cursor-pointer border border-blue-400/30 hover:ring-2 hover:ring-blue-500/50 transition-all"
                title={`Meu Perfil (${session.name})`}
              >
                {session.name.substring(0, 2).toUpperCase()}
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sair da Conta (Logout)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Acesso Seguro
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating notice notification */}
      {lastActionNotice && (
        <div className="bg-slate-900 border-t border-b border-slate-800 py-1.5 px-4 text-center text-xs text-slate-200 animate-in fade-in">
          {lastActionNotice}
        </div>
      )}
    </header>
  );
};
