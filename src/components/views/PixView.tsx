import React, { useState, useEffect } from 'react';
import { useBank } from '../../context/BankContext';
import { Contact } from '../../types';
import { 
  Send, 
  ArrowLeft, 
  User, 
  Key, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  QrCode, 
  Sparkles,
  Info,
  Building,
  Check,
  Users,
  Plus
} from 'lucide-react';

export const PixView: React.FC = () => {
  const { 
    account, 
    sendPix, 
    setCurrentView, 
    ihcMode, 
    contacts, 
    selectedContactForPix, 
    setSelectedContactForPix 
  } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const [recipientName, setRecipientName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [keyType, setKeyType] = useState('CPF');
  const [amountStr, setAmountStr] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Review step state (ONLY used in Improved Mode to prevent errors)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Prefill if selected from CRUD
  useEffect(() => {
    if (selectedContactForPix) {
      setRecipientName(selectedContactForPix.name);
      setPixKey(selectedContactForPix.key);
      setKeyType(selectedContactForPix.keyType);
      setSelectedContactForPix(null);
    }
  }, [selectedContactForPix, setSelectedContactForPix]);

  const handleSelectContact = (contact: Contact) => {
    setRecipientName(contact.name);
    setPixKey(contact.key);
    setKeyType(contact.keyType);
    setErrorMsg(null);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const val = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Informe um valor monetário positivo válido.');
      return;
    }

    if (val > account.balance) {
      setErrorMsg(`Saldo insuficiente. Seu saldo é de R$ ${account.balance.toFixed(2)}.`);
      return;
    }

    if (!pixKey.trim()) {
      setErrorMsg('Informe a chave de endereçamento.');
      return;
    }

    if (isFlawed) {
      // INTENTIONAL IHC FLAW:
      // Direct execution WITHOUT any review confirmation step!
      // No prompt: "Deseja enviar R$ X para Fulano?"
      executeSimulatedPix(val);
    } else {
      // IMPROVED MODE: Open clear review modal for error prevention (Nielsen #5)
      setIsReviewModalOpen(true);
    }
  };

  const executeSimulatedPix = (val: number) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const name = recipientName.trim() || 'Destinatário Pix';
      const result = sendPix(name, pixKey.trim(), keyType, val);

      if (!result.success) {
        setErrorMsg(result.error || 'Erro na operação.');
      } else {
        // If flawed mode, sendPix inside context silently redirected back to 'home'
        // without ANY confirmation modal or success toast!
        setIsReviewModalOpen(false);
      }
    }, isFlawed ? 400 : 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFlawed ? 'Voltar' : 'Voltar ao Início'}
        </button>

        <div className="text-right">
          <span className="text-xs text-slate-400">Saldo disponível:</span>{' '}
          <span className="text-xs font-bold text-white font-mono">
            R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-[#0c1220] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isFlawed ? 'Operação de Envio Instantâneo' : 'Transferência Pix'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFlawed 
                  ? 'Terminal de remessa eletrônica com liquidação pelo SPI' 
                  : 'Envie dinheiro sem custos para qualquer instituição'}
              </p>
            </div>
          </div>
        </div>

        {/* Contacts List / CRUD Quick Access */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">
              {isFlawed ? 'Registros da base:' : 'Contatos salvos (Agenda Pix):'}
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('contacts')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              {isFlawed ? 'Gerenciar dados' : 'Gerenciar Favorecidos (CRUD)'} &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {contacts.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectContact(c)}
                className="p-3 rounded-xl bg-[#080d18] border border-slate-800 hover:border-blue-500/40 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white group-hover:text-blue-400 truncate">
                    {c.nickname || c.name}
                  </p>
                  <span className="text-[10px] font-mono text-blue-400/80">{c.keyType}</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.bank}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Pix Form */}
        <form onSubmit={handlePreSubmit} className="space-y-4">
          {/* Key Type Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Tipo de Chave
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['CPF', 'E-mail', 'Celular', 'Aleatória'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setKeyType(type)}
                  className={`py-2 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                    keyType === type
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-[#080d18] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Key input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Chave Pix ({keyType})
            </label>
            <div className="relative">
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder={
                  keyType === 'CPF'
                    ? '000.000.000-00'
                    : keyType === 'E-mail'
                    ? 'nome@exemplo.com'
                    : keyType === 'Celular'
                    ? '(11) 90000-0000'
                    : 'Chave aleatória UUID'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Beneficiary Name (Optional in real, simulated here) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {isFlawed ? 'Titular / Rótulo de Identificação' : 'Nome do Destinatário'}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ex: Carlos Eduardo Lima"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Valor da Transferência (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-500 font-bold text-sm">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={account.balance}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0,00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-base font-bold text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Flawed Mode Warning / Pedagogical Cue (Subtle note for observers) */}
          {isFlawed && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <span>
                Atenção para a aula de IHC: ao clicar no botão abaixo no Modo Falhas, a transação será executada diretamente sem confirmação e retornará à tela inicial sem comprovante.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isFlawed
                  ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-900/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-cyan-900/30'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isFlawed ? 'Processar Ordem' : 'Revisar e Continuar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ERROR PREVENTION MODAL (Active ONLY in Improved Mode) */}
      {isReviewModalOpen && !isFlawed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Revise os Dados do Pix</h3>
              <p className="text-xs text-slate-400">
                Confira o beneficiário antes de autorizar o débito em conta.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Destinatário</span>
                <span className="font-semibold text-white">{recipientName || 'Destinatário'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Chave Pix</span>
                <span className="font-mono text-slate-300">{pixKey}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Instituição Destino</span>
                <span className="text-slate-300">Banco Horizonte S.A.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Valor da Operação</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  R$ {parseFloat(amountStr.replace(',', '.')).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Saldo restante após envio</span>
                <span className="text-slate-300 font-mono">
                  R$ {(account.balance - parseFloat(amountStr.replace(',', '.'))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Voltar e Corrigir
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => executeSimulatedPix(parseFloat(amountStr.replace(',', '.')))}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-900/30 cursor-pointer"
              >
                {isProcessing ? 'Enviando...' : 'Confirmar Envio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
