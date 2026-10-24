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
  Box, 
  Layers, 
  Compass, 
  Users, 
  FolderDot 
} from 'lucide-react';

export const BottomNavMobile: React.FC = () => {
  const { currentView, setCurrentView, ihcMode } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const items = isFlawed
    ? [
        { id: 'home' as ViewType, label: 'Início', icon: Home },
        { id: 'statement' as ViewType, label: 'Extrato', icon: FileSpreadsheet },
        // Flawed: Pix is labeled "Operações" with Box icon, difficult to spot
        { id: 'pix' as ViewType, label: 'Operações', icon: Box },
        { id: 'contacts' as ViewType, label: 'Registros', icon: FolderDot },
        { id: 'payments' as ViewType, label: 'Serviços', icon: Receipt },
      ]
    : [
        { id: 'home' as ViewType, label: 'Início', icon: Home },
        { id: 'pix' as ViewType, label: 'Pix', icon: Send, highlight: true },
        { id: 'payments' as ViewType, label: 'Pagar', icon: Receipt },
        { id: 'contacts' as ViewType, label: 'Contatos', icon: Users },
        { id: 'statement' as ViewType, label: 'Extrato', icon: FileSpreadsheet },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const isPixHighlight = !isFlawed && (item as any).highlight;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative min-h-[44px] ${
              isActive
                ? isFlawed
                  ? 'text-white'
                  : 'text-blue-400 font-semibold'
                : isFlawed
                ? 'text-slate-500' // Low contrast flaw
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPixHighlight ? (
              <div className="w-10 h-10 -mt-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 border-2 border-slate-950">
                <Icon className="w-5 h-5 text-white" />
              </div>
            ) : (
              <Icon className={`w-5 h-5 ${isActive ? (isFlawed ? 'text-white' : 'text-blue-400') : 'text-slate-500'}`} />
            )}

            {/* In flawed mode: label has tiny text (9px) and poor contrast */}
            <span
              className={`mt-0.5 tracking-tight ${
                isFlawed
                  ? 'text-[9px] text-slate-500'
                  : 'text-[11px] font-medium'
              }`}
            >
              {item.label}
            </span>

            {isActive && !isPixHighlight && (
              <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
