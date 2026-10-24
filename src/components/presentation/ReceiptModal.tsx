import React from 'react';
import { useBank } from '../../context/BankContext';
import { 
  X, 
  CheckCircle2, 
  Share2, 
  Download, 
  FileText, 
  AlertCircle,
  Building2,
  Calendar,
  Hash,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, ihcMode } = useBank();

  if (!activeReceipt) return null;

  const isFlawed = ihcMode === 'flawed';
  const isOutgoing = activeReceipt.amount < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm text-white">
              {isFlawed ? 'Registro de Sistema #491' : 'Comprovante de Transação'}
            </h3>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar comprovante"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flawed View: Raw, Cryptic, Low Human-Communication */}
        {isFlawed ? (
          <div className="p-6 space-y-4 font-mono text-xs text-slate-300">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-amber-400/90 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>REGISTRO BRUTO INTERNO: NENHUMA AUTORIZAÇÃO DE IMPRESSÃO GERADA</span>
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-slate-800/80 space-y-1.5 text-[11px] leading-relaxed text-slate-400">
              <p className="text-slate-200"># TRANSACTION_LOG_DUMP</p>
              <p>ID: {activeReceipt.id}</p>
              <p>TYPE_ENUM: {activeReceipt.type.toUpperCase()}</p>
              <p>RAW_AMOUNT: {activeReceipt.amount}</p>
              <p>STATUS_CODE: {activeReceipt.codeStatus || '200_EXECUTED'}</p>
              <p>TIMESTAMP: {activeReceipt.timestamp}</p>
              <p>SYS_REF: BCO_HRZ_PRD_CLUSTER_03</p>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              * Nota educativa de IHC: Este visual demonstra a falha de Comunicabilidade. O sistema mostra dados da máquina em vez de uma mensagem orientada a humanos.
            </p>

            <button
              onClick={() => setActiveReceipt(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Fechar Janela
            </button>
          </div>
        ) : (
          /* Improved View: High Usability, Clear Information Hierarchy, Legible Feedback */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Transação Concluída com Sucesso</h4>
              <p className="text-2xl font-black text-white font-mono">
                {isOutgoing ? '-' : '+'} R$ {Math.abs(activeReceipt.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className="inline-block text-xs text-slate-400">
                {activeReceipt.timestamp}
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tipo de Operação</span>
                <span className="font-medium text-slate-200">{activeReceipt.description}</span>
              </div>

              {activeReceipt.recipient && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Destinatário</span>
                    <span className="font-medium text-slate-200">{activeReceipt.recipient.name}</span>
                  </div>
                  {activeReceipt.recipient.key && (
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Chave Pix</span>
                      <span className="font-medium text-slate-200">{activeReceipt.recipient.key}</span>
                    </div>
                  )}
                  {activeReceipt.recipient.bank && (
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Instituição</span>
                      <span className="font-medium text-slate-200">{activeReceipt.recipient.bank}</span>
                    </div>
                  )}
                </>
              )}

              {activeReceipt.barcode && (
                <div className="py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Código de Barras</span>
                  <span className="font-mono text-[10px] text-slate-300 break-all">{activeReceipt.barcode}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Autenticação Bancária</span>
                <span className="font-mono text-[10px] text-slate-300">
                  {activeReceipt.id.toUpperCase()}-AUTH-{Date.now().toString().slice(-6)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveReceipt(null)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Salvar Comprovante
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
