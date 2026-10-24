import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { 
  ArrowLeftRight, 
  ArrowLeft, 
  Building2, 
  User, 
  AlertTriangle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const BANKS_LIST = [
  'Banco Horizonte (Mesma Instituição)',
  '001 - Banco do Brasil S.A.',
  '260 - Nubank Pagamentos S.A.',
  '341 - Itaú Unibanco S.A.',
  '104 - Caixa Econômica Federal',
  '033 - Banco Santander Brasil',
  '237 - Banco Bradesco S.A.'
];

export const TransferView: React.FC = () => {
  const { account, transferMoney, setCurrentView, ihcMode } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const [recipientName, setRecipientName] = useState('');
  const [bank, setBank] = useState(BANKS_LIST[0]);
  const [agency, setAgency] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const val = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Informe um valor numérico válido.');
      return;
    }

    if (val > account.balance) {
      setErrorMsg(`Saldo insuficiente. Saldo atual: R$ ${account.balance.toFixed(2)}.`);
      return;
    }

    if (!agency.trim() || !accountNum.trim()) {
      setErrorMsg('Preencha os dados bancários completos.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const res = transferMoney(
        recipientName.trim() || 'Beneficiário TED',
        bank,
        agency.trim(),
        accountNum.trim(),
        val
      );

      if (!res.success) {
        setErrorMsg(res.error || 'Erro na transferência.');
      }
    }, isFlawed ? 350 : 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFlawed ? 'Menu Anterior' : 'Voltar ao Início'}
        </button>

        <div className="text-right">
          <span className="text-xs text-slate-400">Saldo:</span>{' '}
          <span className="text-xs font-bold text-white font-mono">
            R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-[#0c1220] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isFlawed ? 'Transmissão Eletrônica STR / TED' : 'Transferência Bancária'}
            </h2>
            <p className="text-xs text-slate-400">
              {isFlawed 
                ? 'Emissão de compensação interbancária unilateral' 
                : 'Transfira para contas do Banco Horizonte ou outros bancos'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {isFlawed ? 'Entidade Participante do SPB' : 'Instituição Financeira'}
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {BANKS_LIST.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {isFlawed ? 'Nome do Beneficiário Final' : 'Nome de quem vai receber'}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Ex: Roberto Albuquerque"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                {isFlawed ? 'Cód. Agência Sem DV' : 'Agência (sem dígito)'}
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="Ex: 0001"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                {isFlawed ? 'Conta com DV Anexo' : 'Conta com dígito'}
              </label>
              <input
                type="text"
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                placeholder="Ex: 12345-6"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-base font-bold text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isFlawed
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-900/30'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  {isFlawed ? 'Efetivar TED' : 'Confirmar Transferência'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
