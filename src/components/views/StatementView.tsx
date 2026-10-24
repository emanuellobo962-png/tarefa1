import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { 
  FileSpreadsheet, 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Download, 
  FileText,
  SlidersHorizontal
} from 'lucide-react';

export const StatementView: React.FC = () => {
  const { account, transactions, setCurrentView, setActiveReceipt, ihcMode } = useBank();

  const isFlawed = ihcMode === 'flawed';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out' | 'pix'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'in') return tx.amount > 0;
    if (filterType === 'out') return tx.amount < 0;
    if (filterType === 'pix') return tx.type.includes('pix');

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFlawed ? 'Voltar' : 'Voltar ao Início'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Saldo atual:</span>
          <span className="text-xs font-bold text-white font-mono">
            R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-[#0c1220] border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isFlawed ? 'Registro Geral de Lançamentos em Conta' : 'Extrato da Conta Corrente'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFlawed 
                  ? 'Livro diário de compensação e liquidação de créditos/débitos' 
                  : 'Acompanhe todas as suas entradas, saídas e comprovantes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Download do extrato OFX/PDF iniciado.')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição, estabelecimento ou recebedor..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Tudo' },
              { id: 'in', label: 'Entradas' },
              { id: 'out', label: 'Saídas' },
              { id: 'pix', label: 'Pix' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 divide-y divide-slate-850 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhuma movimentação encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isNegative = tx.amount < 0;

              return (
                <div
                  key={tx.id}
                  onClick={() => setActiveReceipt(tx)}
                  className="p-4 flex items-center justify-between hover:bg-slate-850/60 transition-colors cursor-pointer group"
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
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                          {tx.title}
                        </p>
                        <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded hidden sm:inline-block">
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {isFlawed && tx.codeStatus ? (
                          <span className="font-mono text-slate-500 text-[10px]">
                            SYS_CODE: {tx.codeStatus} • {tx.timestamp}
                          </span>
                        ) : (
                          <span>{tx.description} • {tx.timestamp}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <p
                      className={`text-sm font-bold font-mono ${
                        isNegative ? 'text-white' : 'text-emerald-400'
                      }`}
                    >
                      {isNegative ? '-' : '+'} R${' '}
                      {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-purple-400 group-hover:underline flex items-center justify-end gap-1 mt-0.5">
                      <FileText className="w-3 h-3" />
                      {isFlawed ? 'Ver log' : 'Comprovante'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
