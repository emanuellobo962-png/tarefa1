import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { DEFAULT_CREDENTIALS } from '../../data/initialData';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Key, 
  Sparkles, 
  HelpCircle,
  X,
  User,
  UserPlus,
  UserCheck,
  Fingerprint
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, registerUser, registeredUsers, ihcMode } = useBank();
  const isFlawed = ihcMode === 'flawed';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals for Forgot Password and Create Account
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Create Account / Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBalance, setRegBalance] = useState('1500');
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  // Handle Caps Lock check on key up / down
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = login(email, password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || 'Falha na autenticação.');
        if (isFlawed) {
          // Intentional IHC Flaw: Wipes all typed text on failure, causing frustration
          setPassword('');
        }
      }
    }, isFlawed ? 350 : 500);
  };

  const handleSelectUser = (userEmail: string, userPass?: string) => {
    setEmail(userEmail);
    setPassword(userPass || 'senha123');
    setErrorMessage(null);
  };

  const handleAppendGmailDomain = () => {
    if (!email.includes('@')) {
      setEmail(email + '@gmail.com');
    }
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotModalOpen(false);
    }, 2500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);

    const res = await registerUser(regName, regEmail, regPassword, parseFloat(regBalance) || 1500);
    setRegLoading(false);

    if (res.success && res.user) {
      setEmail(res.user.email);
      setPassword(res.user.password || regPassword);
      setIsRegisterModalOpen(false);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setErrorMessage(null);
    } else {
      setRegError(res.error || 'Erro ao registrar usuário.');
    }
  };

  const openRegisterWithEmail = () => {
    setRegEmail(email.endsWith('@gmail.com') ? email : (email.includes('@') ? email : `${email}@gmail.com`));
    setRegError(null);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand & Horizon Logo */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-900/40 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute -bottom-4 w-10 h-10 rounded-full border-2 border-cyan-400/80 bg-blue-900/30"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300/80 z-10 -translate-y-0.5"></div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              BANCO HORIZONTE
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFlawed
                ? 'Terminal de Autenticação Segura v4.19'
                : 'Acesse sua conta digital com Gmail e senha'}
            </p>
          </div>
        </div>

        {/* Registered Users Quick Selector */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 block text-[11px] font-semibold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Usuários Registrados ({registeredUsers.length}):
            </span>
            <button
              type="button"
              onClick={() => {
                setRegEmail('');
                setRegError(null);
                setIsRegisterModalOpen(true);
              }}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <UserPlus className="w-3 h-3" />
              Cadastrar Novo
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {registeredUsers.map((u) => {
              const isSelected = email.toLowerCase() === u.email.toLowerCase();
              return (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleSelectUser(u.email, u.password)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                  title={`Clique para preencher ${u.name} (${u.email})`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold">{u.name.split(' ')[0]}</span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">({u.email})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {/* Gmail Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">
                {isFlawed ? 'String de Acesso / URI' : 'E-mail Gmail'}
              </label>
              {!email.includes('@') && email.length > 2 && !isFlawed && (
                <button
                  type="button"
                  onClick={handleAppendGmailDomain}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                >
                  + @gmail.com
                </button>
              )}
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFlawed ? 'identificador@dominio' : 'seu.email@gmail.com'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">
                {isFlawed ? 'Credencial Criptográfica' : 'Senha de Acesso'}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Esqueci a senha
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword && !isFlawed ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyUp}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono"
                required
              />

              {/* Password visibility toggle: Intentionally ABSENT in flawed mode! */}
              {!isFlawed && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Caps Lock Warning (Only in Improved Mode - Nielsen #1 & Error Prevention) */}
            {!isFlawed && isCapsLockOn && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Atenção: A tecla <strong>Caps Lock</strong> está ativada.</span>
              </div>
            )}
          </div>

          {/* Remember me & Options */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <span>Lembrar meu Gmail</span>
            </label>

            {!isFlawed && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Protegido por TLS
              </span>
            )}
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isFlawed
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' // FLAW: Generic machine label
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-900/30 font-extrabold'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isFlawed ? 'Submeter Credenciais' : 'Entrar na Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          <p>Banco Horizonte S.A. • CNPJ 00.394.460/0001-00</p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            Ambiente de Simulação Acadêmica para Disciplina de IHC
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Recuperação de Senha</h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400 mb-1" />
                <p className="font-semibold">Instruções enviadas!</p>
                <p className="text-[11px] text-emerald-400/90">
                  Verifique a caixa de entrada do seu Gmail para redefinir o acesso.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRecovery} className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Informe o seu e-mail Gmail cadastrado para receber o link de redefinição de senha:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu.email@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Enviar Link de Recuperação
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Account Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Criar Conta no Banco Horizonte</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: João Victor Santos"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">E-mail Gmail</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="usuario@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Senha de Acesso</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Saldo Inicial Simulado (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={regBalance}
                  onChange={(e) => setRegBalance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40"
                >
                  {regLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Concluir Cadastro</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
