import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { 
  Settings, 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  SlidersHorizontal, 
  Bell, 
  RotateCcw, 
  Lock, 
  Smartphone, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  LogOut,
  Mail
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { account, session, logout, setCurrentView, resetDemo, ihcMode } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const [pixLimit, setPixLimit] = useState(account.pixLimit);
  const [nightLimit, setNightLimit] = useState(1000);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFlawed ? 'Retornar' : 'Voltar ao Início'}
        </button>

        <span className="text-xs text-slate-400">
          Versão do Aplicativo: 4.19.0-bh
        </span>
      </div>

      <div className="rounded-3xl bg-[#0c1220] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isFlawed ? 'Parâmetros Gerais do Terminal' : 'Configurações da Conta'}
            </h2>
            <p className="text-xs text-slate-400">
              {isFlawed 
                ? 'Ajuste de variáveis operacionais do usuário' 
                : 'Gerencie limites Pix, segurança e dados cadastrais'}
            </p>
          </div>
        </div>

        {/* Profile Details with Gmail */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-md">
              {session.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{session.name}</p>
              <p className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                <Mail className="w-3 h-3 text-cyan-500" />
                {session.email}
              </p>
              <p className="text-[10px] text-slate-500">
                CPF: ***.718.392-** • Agência: {account.agency} • Conta: {account.account}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da Conta
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Pix Limits */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">
                {isFlawed ? 'Teto Transacional Alíquota SPI' : 'Limites de Transferência Pix'}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Limite Diário (Diurno):</span>
                <span className="font-bold text-cyan-400 font-mono">
                  R$ {pixLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={pixLimit}
                onChange={(e) => setPixLimit(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                {isFlawed 
                  ? 'Limitação do subsistema de liquidação de mensagens' 
                  : 'Válido para operações realizadas entre 06:00 e 20:00'}
              </p>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">
                {isFlawed ? 'Disparo de Telemetria Push' : 'Notificações no Celular'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isFlawed 
                  ? 'Envio de telemetria de status de lote' 
                  : 'Receba avisos instantâneos a cada débito ou Pix recebido'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notificationsEnabled ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  notificationsEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs text-center">
              Configurações atualizadas com sucesso!
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
          >
            {isFlawed ? 'Gravar Alterações' : 'Salvar Preferências'}
          </button>
        </form>

        {/* Reset Demo Option */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-300">Reiniciar Demonstração Acadêmica</p>
            <p className="text-[11px] text-slate-500">Restaura saldo para R$ 1.250,00 e o extrato inicial</p>
          </div>
          <button
            type="button"
            onClick={resetDemo}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Restaurar Valores Padrão
          </button>
        </div>
      </div>
    </div>
  );
};
