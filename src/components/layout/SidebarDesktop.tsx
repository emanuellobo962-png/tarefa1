import React from 'react';
import { useBank } from '../../context/BankContext';
import { ViewType } from '../../types';
import { 
  Home, 
  Send, 
  Receipt, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
  FolderDot,
  Box,
  Users
} from 'lucide-react';

export const SidebarDesktop: React.FC = () => {
  const { currentView, setCurrentView, ihcMode, session, account } = useBank();

  const isFlawed = ihcMode === 'flawed';

  // Navigation items differing based on IHC mode
  const navItems = isFlawed
    ? [
        { id: 'home' as ViewType, label: 'Início', icon: Home },
        { id: 'statement' as ViewType, label: 'Extrato', icon: FileSpreadsheet },
        // FLAW: Pix is labeled vaguely as "Operações" or "Serviços Digitais"
        { id: 'pix' as ViewType, label: 'Operações', icon: Box },
        { id: 'payments' as ViewType, label: 'Serviços', icon: Receipt },
        { id: 'transfers' as ViewType, label: 'Outros', icon: ArrowLeftRight },
        { id: 'contacts' as ViewType, label: 'Registros', icon: FolderDot },
        { id: 'settings' as ViewType, label: 'Terminal', icon: Settings },
      ]
    : [
        { id: 'home' as ViewType, label: 'Início', icon: Home },
        { id: 'pix' as ViewType, label: 'Área Pix', icon: Send, highlight: true },
        { id: 'payments' as ViewType, label: 'Pagar Boletos', icon: Receipt },
        { id: 'transfers' as ViewType, label: 'Transferências', icon: ArrowLeftRight },
        { id: 'statement' as ViewType, label: 'Extrato Completo', icon: FileSpreadsheet },
        { id: 'contacts' as ViewType, label: 'Favorecidos & Chaves', icon: Users },
        { id: 'settings' as ViewType, label: 'Configurações', icon: Settings },
      ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950/70 border-r border-slate-800/80 p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {isFlawed ? 'Menu Geral' : 'Navegação'}
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? isFlawed
                        ? 'bg-slate-800 text-white font-semibold shadow-xs'
                        : 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  } ${!isFlawed && (item as any).highlight && !isActive ? 'text-slate-300 font-medium' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? (isFlawed ? 'text-slate-200' : 'text-blue-400') : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Informational Callout (Differs by mode) */}
        {isFlawed ? (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <FolderDot className="w-3.5 h-3.5 text-slate-500" />
              <span>Módulo Adicional</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Solicite consórcio habitacional ou empréstimo pré-aprovado.
            </p>
            <button className="text-[11px] text-slate-300 font-medium hover:underline cursor-pointer block">
              Consultar opções &rarr;
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#0d1424] border border-blue-900/40 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Ambiente Seguro</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pix protegido por TLS 1.3 e conformidade com as diretrizes do Banco Central.
            </p>
          </div>
        )}
      </div>

      {/* Account quick identity card (Dynamic) */}
      <div className="pt-4 border-t border-slate-800/80 text-xs">
        <p className="font-semibold text-white truncate">{session.name}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Ag. {account.agency} · C/C {account.account}</p>
        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{session.email}</p>
      </div>
    </aside>
  );
};
