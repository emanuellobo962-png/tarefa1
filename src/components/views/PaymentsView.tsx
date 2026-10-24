import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { 
  Receipt, 
  ArrowLeft, 
  Barcode, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Building,
  CreditCard,
  Zap,
  Wifi,
  Home
} from 'lucide-react';

const SAMPLE_BILLS = [
  {
    title: 'Energia Elétrica - Enel Brasil',
    barcode: '84630000001 8 54200109011 8 00456123456 1 00000000000 0',
    amount: 142.80,
    dueDate: '20/10/2026',
    category: 'Consumo',
    icon: Zap
  },
  {
    title: 'Internet Fibra UltraNet',
    barcode: '34191.79001 01043.510047 91020.150008 8 9988000000',
    amount: 99.90,
    dueDate: '25/10/2026',
    category: 'Telecom',
    icon: Wifi
  },
  {
    title: 'Taxa Condominial Ed. Solar',
    barcode: '00190.00009 02345.678901 23456.789012 3 8877000000',
    amount: 320.00,
    dueDate: '15/10/2026',
    category: 'Moradia',
    icon: Home
  }
];

export const PaymentsView: React.FC = () => {
  const { account, payBill, setCurrentView, ihcMode } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectSample = (bill: typeof SAMPLE_BILLS[0]) => {
    setDescription(bill.title);
    setBarcode(bill.barcode);
    setAmountStr(bill.amount.toFixed(2));
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const val = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Informe um valor de liquidação válido.');
      return;
    }

    if (val > account.balance) {
      setErrorMsg(`Saldo insuficiente. Disponível: R$ ${account.balance.toFixed(2)}.`);
      return;
    }

    if (!barcode.trim()) {
      setErrorMsg('Informe o código de barras ou linha digitável.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const res = payBill(description || 'Pagamento de Título', barcode, val);
      if (!res.success) {
        setErrorMsg(res.error || 'Falha no processamento.');
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
          {isFlawed ? 'Retornar' : 'Voltar ao Início'}
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
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isFlawed ? 'Módulo de Liquidação Compensatória' : 'Pagamento de Contas e Boletos'}
            </h2>
            <p className="text-xs text-slate-400">
              {isFlawed 
                ? 'Inserção de títulos e ordens de débito bancário' 
                : 'Pague contas de água, luz, internet e boletos diversos'}
            </p>
          </div>
        </div>

        {/* Quick Sample Invoices */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">
            {isFlawed ? 'Títulos pré-cadastrados:' : 'Boletos pendentes para teste rápido:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_BILLS.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.title}
                  type="button"
                  onClick={() => handleSelectSample(b)}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] text-slate-500">Venc. {b.dueDate}</span>
                  </div>
                  <p className="text-xs font-medium text-white truncate group-hover:text-blue-300">
                    {b.title}
                  </p>
                  <p className="text-xs font-bold font-mono text-cyan-400 mt-1">
                    R$ {b.amount.toFixed(2)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {isFlawed ? 'Linha Digitável / Identificador Numérico' : 'Código de Barras ou Linha Digitável'}
            </label>
            <div className="relative">
              <Barcode className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              {isFlawed ? 'Rótulo da Conta' : 'Descrição do Pagamento (Opcional)'}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Conta de Luz"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Valor a Pagar (R$)
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-base font-bold text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-colors"
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
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  {isFlawed ? 'Submeter Operação' : 'Confirmar Pagamento'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
