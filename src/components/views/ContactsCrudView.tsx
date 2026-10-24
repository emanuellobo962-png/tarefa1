import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Contact, PixKeyType, UserPixKey } from '../../types';
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Send, 
  Key, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  UserCheck, 
  ShieldAlert,
  Info,
  Filter
} from 'lucide-react';

const BANKS_OPTIONS = [
  'Banco Horizonte',
  'Nubank Pagamentos S.A.',
  '001 - Banco do Brasil S.A.',
  '341 - Itaú Unibanco S.A.',
  '104 - Caixa Econômica Federal',
  '033 - Banco Santander Brasil',
  '237 - Banco Bradesco S.A.',
  'Outra Instituição Financeira'
];

export const ContactsCrudView: React.FC = () => {
  const { 
    contacts, 
    userPixKeys, 
    addContact, 
    updateContact, 
    deleteContact, 
    addUserPixKey, 
    deleteUserPixKey, 
    setCurrentView, 
    setSelectedContactForPix,
    ihcMode 
  } = useBank();

  const isFlawed = ihcMode === 'flawed';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'contacts' | 'my_keys'>('contacts');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal states for Contact CRUD
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form Fields for Contact
  const [formName, setFormName] = useState('');
  const [formNickname, setFormNickname] = useState('');
  const [formKey, setFormKey] = useState('');
  const [formKeyType, setFormKeyType] = useState<PixKeyType>('CPF');
  const [formBank, setFormBank] = useState(BANKS_OPTIONS[0]);
  const [formAgency, setFormAgency] = useState('');
  const [formAccount, setFormAccount] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [contactFormError, setContactFormError] = useState<string | null>(null);

  // Delete Confirmation Modal (used in Improved Mode for Error Prevention)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<UserPixKey | null>(null);

  // My Keys Form State
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [newKeyType, setNewKeyType] = useState<PixKeyType>('Aleatória');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [keyFormError, setKeyFormError] = useState<string | null>(null);

  // Copied indicator
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.nickname && c.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.key.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType !== 'all' && c.keyType !== filterType) return false;
    return true;
  });

  // Open Create Contact Modal
  const handleOpenCreateContact = () => {
    setEditingContactId(null);
    setFormName('');
    setFormNickname('');
    setFormKey('');
    setFormKeyType('CPF');
    setFormBank(BANKS_OPTIONS[0]);
    setFormAgency('');
    setFormAccount('');
    setFormNotes('');
    setContactFormError(null);
    setIsContactModalOpen(true);
  };

  // Open Edit Contact Modal
  const handleOpenEditContact = (c: Contact) => {
    setEditingContactId(c.id);
    setFormName(c.name);
    setFormNickname(c.nickname || '');
    setFormKey(c.key);
    setFormKeyType(c.keyType);
    setFormBank(c.bank);
    setFormAgency(c.agency || '');
    setFormAccount(c.account || '');
    setFormNotes(c.notes || '');
    setContactFormError(null);
    setIsContactModalOpen(true);
  };

  // Submit Contact Form (Create or Update)
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormError(null);

    if (!formName.trim()) {
      setContactFormError('Informe o nome do favorecido.');
      return;
    }
    if (!formKey.trim()) {
      setContactFormError('Informe a chave Pix.');
      return;
    }

    if (editingContactId) {
      // UPDATE
      const res = updateContact(editingContactId, {
        name: formName.trim(),
        nickname: formNickname.trim() || undefined,
        key: formKey.trim(),
        keyType: formKeyType,
        bank: formBank,
        agency: formAgency.trim() || undefined,
        account: formAccount.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });

      if (!res.success) {
        setContactFormError(res.error || 'Erro ao atualizar.');
        return;
      }
    } else {
      // CREATE
      const res = addContact({
        name: formName.trim(),
        nickname: formNickname.trim() || undefined,
        key: formKey.trim(),
        keyType: formKeyType,
        bank: formBank,
        agency: formAgency.trim() || undefined,
        account: formAccount.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });

      if (!res.success) {
        setContactFormError(res.error || 'Erro ao adicionar contato.');
        return;
      }
    }

    setIsContactModalOpen(false);
  };

  // Delete Contact trigger
  const handleDeleteContactClick = (c: Contact) => {
    if (isFlawed) {
      // INTENTIONAL IHC FLAW: Direct deletion without confirmation dialog!
      // Violates Nielsen Heuristic #5 (Error Prevention) and Norman's Safety rule.
      deleteContact(c.id);
    } else {
      // IMPROVED MODE: Show safe confirmation modal
      setContactToDelete(c);
    }
  };

  const handleConfirmDeleteContact = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      setContactToDelete(null);
    }
  };

  // Send Pix directly to contact
  const handleTransferToContact = (c: Contact) => {
    setSelectedContactForPix(c);
    setCurrentView('pix');
  };

  // Add User Pix Key
  const handleSaveUserKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyFormError(null);

    let val = newKeyValue.trim();
    if (newKeyType === 'Aleatória') {
      val = crypto.randomUUID ? crypto.randomUUID() : `k-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    if (!val) {
      setKeyFormError('Informe o valor da chave.');
      return;
    }

    const res = addUserPixKey(val, newKeyType, newKeyLabel);
    if (!res.success) {
      setKeyFormError(res.error || 'Erro ao cadastrar chave.');
      return;
    }

    setIsAddKeyModalOpen(false);
    setNewKeyValue('');
    setNewKeyLabel('');
  };

  // Delete User Key Trigger
  const handleDeleteUserKeyClick = (k: UserPixKey) => {
    if (isFlawed) {
      deleteUserPixKey(k.id);
    } else {
      setKeyToDelete(k);
    }
  };

  const handleCopyKey = (keyText: string, id: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFlawed ? 'Voltar' : 'Voltar ao Início'}
        </button>

        <span className="text-xs text-slate-400">
          {contacts.length} favorecidos cadastrados
        </span>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#0c1220] border border-slate-800 p-6 shadow-xl space-y-6">
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isFlawed ? 'Diretório de Entidades & Chaves' : 'Agenda de Favorecidos & Chaves Pix'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFlawed
                  ? 'Manutenção cadastral de registros receptores (CRUD)'
                  : 'Gerencie contatos frequentes, edite dados e cadastre suas chaves Pix'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'contacts' ? (
              <button
                onClick={handleOpenCreateContact}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isFlawed
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-cyan-900/30'
                }`}
              >
                <Plus className="w-4 h-4" />
                {isFlawed ? 'Novo Registro' : 'Novo Favorecido'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setNewKeyType('Aleatória');
                  setNewKeyValue('');
                  setNewKeyLabel('');
                  setKeyFormError(null);
                  setIsAddKeyModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Chave Pix
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation: Favorecidos vs Minhas Chaves */}
        <div className="flex border-b border-slate-800 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'contacts'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Favorecidos Salvos ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('my_keys')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_keys'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Key className="w-4 h-4" />
            Minhas Chaves Pix ({userPixKeys.length})
          </button>
        </div>

        {/* TAB 1: FAVORECIDOS (CRUD COMPLETO) */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isFlawed
                      ? 'Filtrar parâmetros de busca...'
                      : 'Buscar favorecido por nome, apelido ou chave...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {['all', 'CPF', 'E-mail', 'Celular', 'CNPJ'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-xl font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === t
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'all' ? 'Todos os Tipos' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Contacts Cards Grid */}
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                Nenhum favorecido localizado. Clique em "+ Novo Favorecido" para criar um cadastro.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div>
                      {/* Top line: Name, Nickname & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {contact.name}
                            </h4>
                            {contact.nickname && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300">
                                {contact.nickname}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{contact.bank}</span>
                            {contact.agency && contact.account && (
                              <span className="text-slate-500">
                                • Ag {contact.agency} / C/C {contact.account}
                              </span>
                            )}
                          </p>
                        </div>

                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                          {contact.keyType}
                        </span>
                      </div>

                      {/* Pix Key Display with Copy */}
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-300 truncate max-w-[220px]">
                          {contact.key}
                        </span>
                        <button
                          onClick={() => handleCopyKey(contact.key, contact.id)}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copiar chave"
                        >
                          {copiedKeyId === contact.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {contact.notes && (
                        <p className="text-[11px] text-slate-500 mt-2 italic">
                          "{contact.notes}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Buttons: Transfer, Edit, Delete */}
                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTransferToContact(contact)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-cyan-400" />
                        Transferir Pix
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditContact(contact)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                          title="Editar cadastro"
                          aria-label="Editar cadastro"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteContactClick(contact)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isFlawed
                              ? 'bg-slate-900 text-slate-600 hover:text-slate-400 border border-slate-800' // FLAW: Unobtrusive, low contrast, deletes without warning!
                              : 'bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 hover:text-rose-200 border border-rose-800/40'
                          }`}
                          title={isFlawed ? 'Remover' : 'Excluir favorecido com confirmação'}
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MINHAS CHAVES PIX (CRUD COMPLETO) */}
        {activeTab === 'my_keys' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Chaves Pix da Conta Horizonte</p>
                <p className="text-slate-400 text-[11px]">
                  Vincule chaves para receber transferências instantâneas diretamente no saldo de R$ 1.250,00.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-1 rounded-lg">
                {userPixKeys.length} / 5 chaves
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userPixKeys.map((k) => (
                <div
                  key={k.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-400 shrink-0" />
                        <h4 className="text-xs font-bold text-white">{k.label}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Cadastrada em {k.createdAt}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50 text-cyan-300">
                      {k.keyType}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-200">
                    <span className="truncate max-w-[210px]">{k.key}</span>
                    <button
                      onClick={() => handleCopyKey(k.key, k.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copiar chave"
                    >
                      {copiedKeyId === k.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Ativa para recebimentos
                    </span>

                    <button
                      onClick={() => handleDeleteUserKeyClick(k)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Excluir chave"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CREATE / EDIT CONTACT */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  {editingContactId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-sm text-white">
                  {editingContactId
                    ? isFlawed
                      ? 'Atualização de Registro'
                      : 'Editar Favorecido'
                    : isFlawed
                    ? 'Inclusão de Entidade Receptora'
                    : 'Cadastrar Novo Favorecido'}
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-6 space-y-4 text-xs">
              {/* Name & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-medium text-slate-300">
                    {isFlawed ? 'Identificador Nominal' : 'Nome Completo *'}
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Lima"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-medium text-slate-300">
                    {isFlawed ? 'Pseudônimo / Label' : 'Apelido (Opcional)'}
                  </label>
                  <input
                    type="text"
                    value={formNickname}
                    onChange={(e) => setFormNickname(e.target.value)}
                    placeholder="Ex: Colega de Trabalho"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Key Type & Key */}
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">
                  {isFlawed ? 'Classificador do Índice' : 'Tipo de Chave Pix'}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['CPF', 'E-mail', 'Celular', 'Aleatória', 'CNPJ'] as PixKeyType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormKeyType(t)}
                      className={`py-1.5 rounded-lg font-medium border text-[11px] transition-colors cursor-pointer ${
                        formKeyType === t
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">
                  {isFlawed ? 'String de Indexação' : `Chave Pix (${formKeyType}) *`}
                </label>
                <input
                  type="text"
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value)}
                  placeholder={
                    formKeyType === 'CPF'
                      ? '000.000.000-00'
                      : formKeyType === 'E-mail'
                      ? 'usuario@email.com'
                      : formKeyType === 'Celular'
                      ? '(11) 98765-4321'
                      : formKeyType === 'CNPJ'
                      ? '00.000.000/0001-00'
                      : 'Chave aleatória UUID'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  required
                />
              </div>

              {/* Bank Selector */}
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">
                  {isFlawed ? 'Agente de Liquidação' : 'Instituição Financeira'}
                </label>
                <select
                  value={formBank}
                  onChange={(e) => setFormBank(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {BANKS_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agency & Account */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-medium text-slate-300">
                    Agência (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formAgency}
                    onChange={(e) => setFormAgency(e.target.value)}
                    placeholder="0001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-medium text-slate-300">
                    Conta Corrente (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    placeholder="12345-6"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">
                  {isFlawed ? 'Anotação Operacional' : 'Observações (Opcional)'}
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ex: Aluguel mensal, freela design..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {contactFormError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{contactFormError}</span>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    isFlawed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' // FLAW: indistinguishable visual weight
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isFlawed ? 'Abortar' : 'Cancelar'}
                </button>

                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    isFlawed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600' // FLAW: vague label and weak visual hierarchy
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-950/30'
                  }`}
                >
                  {isFlawed
                    ? 'Gravar Objeto'
                    : editingContactId
                    ? 'Salvar Alterações'
                    : 'Cadastrar Favorecido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MY PIX KEY */}
      {isAddKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Cadastrar Chave Pix</h3>
              </div>
              <button
                onClick={() => setIsAddKeyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserKey} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">Tipo da Nova Chave</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['CPF', 'E-mail', 'Celular', 'Aleatória'] as PixKeyType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewKeyType(t)}
                      className={`py-1.5 rounded-lg font-medium border text-[11px] transition-colors cursor-pointer ${
                        newKeyType === t
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {newKeyType !== 'Aleatória' ? (
                <div className="space-y-1.5">
                  <label className="block font-medium text-slate-300">Valor da Chave</label>
                  <input
                    type="text"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    placeholder={
                      newKeyType === 'CPF'
                        ? '482.910.371-55'
                        : newKeyType === 'E-mail'
                        ? 'ana.silva@email.com'
                        : '(11) 98765-4321'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    required
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  Uma chave alfanumérica de 36 caracteres exclusiva (EVP/UUID) será gerada pelo Banco Central e vinculada à sua conta.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block font-medium text-slate-300">Apelido da Chave (Opcional)</label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="Ex: Chave para Vendas, Chave Familiar..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {keyFormError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{keyFormError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddKeyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  Cadastrar Chave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE CONTACT (Prevenção de Erros - Nielsen #5) */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-1">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Excluir Favorecido?</h3>
              <p className="text-xs text-slate-300">
                Tem certeza que deseja remover <strong className="text-white">"{contactToDelete.name}"</strong> da sua agenda de contatos?
              </p>
              <p className="text-[11px] text-slate-500">
                Esta ação apagará a chave cadastrada ({contactToDelete.key}) da sua lista rápida.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteContact}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE USER PIX KEY */}
      {keyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-1">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Remover Chave Pix?</h3>
              <p className="text-xs text-slate-300">
                Deseja desativar a chave Pix <strong className="text-white">"{keyToDelete.label}"</strong>?
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {keyToDelete.key}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setKeyToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUserPixKey(keyToDelete.id);
                  setKeyToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
