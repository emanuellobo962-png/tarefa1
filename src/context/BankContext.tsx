import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, UserAccount, ViewType, IhcMode, Contact, UserPixKey, PixKeyType, UserSession, RegisteredUser } from '../types';
import { INITIAL_ACCOUNT, INITIAL_TRANSACTIONS, INITIAL_CONTACTS, INITIAL_USER_KEYS, DEFAULT_CREDENTIALS, INITIAL_REGISTERED_USERS } from '../data/initialData';

interface BankContextType {
  account: UserAccount;
  transactions: Transaction[];
  contacts: Contact[];
  userPixKeys: UserPixKey[];
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  ihcMode: IhcMode;
  setIhcMode: (mode: IhcMode) => void;
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  deviceMode: 'responsive' | 'mobile' | 'desktop';
  setDeviceMode: (mode: 'responsive' | 'mobile' | 'desktop') => void;
  isPresenterModalOpen: boolean;
  setIsPresenterModalOpen: (open: boolean) => void;
  activeReceipt: Transaction | null;
  setActiveReceipt: (tx: Transaction | null) => void;
  lastActionNotice: string | null;
  setLastActionNotice: (notice: string | null) => void;
  selectedContactForPix: Contact | null;
  setSelectedContactForPix: (contact: Contact | null) => void;

  // Authentication: Gmail + Senha com validação rigorosa de usuários registrados
  session: UserSession;
  registeredUsers: RegisteredUser[];
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string, initialBalance?: number) => Promise<{ success: boolean; error?: string; user?: RegisteredUser }>;
  logout: () => void;
  quickDemoLogin: () => void;
  
  // Financial actions
  sendPix: (recipientName: string, key: string, keyType: string, amount: number) => { success: boolean; error?: string };
  payBill: (description: string, barcode: string, amount: number) => { success: boolean; error?: string };
  transferMoney: (recipientName: string, bank: string, agency: string, account: string, amount: number) => { success: boolean; error?: string };
  resetDemo: () => void;

  // CRUD: Contatos e Favorecidos Pix
  addContact: (data: Omit<Contact, 'id' | 'createdAt'>) => { success: boolean; contact?: Contact; error?: string };
  updateContact: (id: string, updates: Partial<Contact>) => { success: boolean; error?: string };
  deleteContact: (id: string) => { success: boolean; error?: string };

  // CRUD: Minhas Chaves Pix
  addUserPixKey: (key: string, keyType: PixKeyType, label: string) => { success: boolean; error?: string };
  deleteUserPixKey: (id: string) => { success: boolean; error?: string };
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('bh_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((u: any) => u.email !== 'emanuellobo962@gmail.com');
        }
      } catch (e) {}
    }
    return INITIAL_REGISTERED_USERS;
  });

  const [account, setAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('bh_account');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNT;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bh_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('bh_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [userPixKeys, setUserPixKeys] = useState<UserPixKey[]>(() => {
    const saved = localStorage.getItem('bh_user_keys');
    return saved ? JSON.parse(saved) : INITIAL_USER_KEYS;
  });

  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('bh_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      isAuthenticated: true,
      email: DEFAULT_CREDENTIALS.email,
      name: DEFAULT_CREDENTIALS.name,
      rememberMe: true,
      lastLogin: 'Hoje, 09:15',
    };
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [ihcMode, setIhcMode] = useState<IhcMode>('flawed'); // Default is flawed for academic demo!
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile' | 'desktop'>('responsive');
  const [isPresenterModalOpen, setIsPresenterModalOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [lastActionNotice, setLastActionNotice] = useState<string | null>(null);
  const [selectedContactForPix, setSelectedContactForPix] = useState<Contact | null>(null);

  useEffect(() => {
    localStorage.setItem('bh_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('bh_account', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('bh_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bh_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('bh_user_keys', JSON.stringify(userPixKeys));
  }, [userPixKeys]);

  useEffect(() => {
    localStorage.setItem('bh_session', JSON.stringify(session));
  }, [session]);

  // Sync with Cloud SQL PostgreSQL backend if running
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        // First sync registered users list
        fetch('/api/auth/registered-users')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              setRegisteredUsers(prev => {
                const merged = prev.filter(u => u.email !== 'emanuellobo962@gmail.com');
                for (const item of data) {
                  if (item.email === 'emanuellobo962@gmail.com') continue;
                  const idx = merged.findIndex(u => u.email.toLowerCase() === item.email.toLowerCase());
                  if (idx >= 0) {
                    merged[idx] = {
                      ...merged[idx],
                      name: item.name,
                      agency: item.agency,
                      account: item.account,
                      balance: parseFloat(item.balance) || merged[idx].balance,
                    };
                  } else {
                    merged.push({
                      email: item.email,
                      password: 'senha123',
                      name: item.name,
                      agency: item.agency,
                      account: item.account,
                      balance: parseFloat(item.balance) || 1250,
                      pixLimit: parseFloat(item.pixLimit) || 3000,
                    });
                  }
                }
                return merged;
              });
            }
          })
          .catch(() => {});

        const [accRes, contactsRes, keysRes, txRes] = await Promise.allSettled([
          fetch('/api/account'),
          fetch('/api/contacts'),
          fetch('/api/pix-keys'),
          fetch('/api/transactions'),
        ]);

        if (accRes.status === 'fulfilled' && accRes.value.ok) {
          const accData = await accRes.value.json();
          if (accData && accData.name) {
            setAccount(prev => ({
              ...prev,
              name: accData.name,
              balance: parseFloat(accData.balance) || prev.balance,
              agency: accData.agency || prev.agency,
              account: accData.account || prev.account,
              pixLimit: parseFloat(accData.pixLimit) || prev.pixLimit,
            }));
          }
        }

        if (contactsRes.status === 'fulfilled' && contactsRes.value.ok) {
          const contactsData = await contactsRes.value.json();
          if (Array.isArray(contactsData) && contactsData.length > 0) {
            setContacts(contactsData.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              nickname: c.nickname || undefined,
              key: c.key,
              keyType: c.keyType,
              bank: c.bank,
              agency: c.agency || undefined,
              account: c.account || undefined,
              notes: c.notes || undefined,
              createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : 'Hoje',
            })));
          }
        }

        if (keysRes.status === 'fulfilled' && keysRes.value.ok) {
          const keysData = await keysRes.value.json();
          if (Array.isArray(keysData) && keysData.length > 0) {
            setUserPixKeys(keysData.map((k: any) => ({
              id: String(k.id),
              key: k.key,
              keyType: k.keyType,
              label: k.label,
              createdAt: k.createdAt ? new Date(k.createdAt).toLocaleDateString('pt-BR') : 'Hoje',
            })));
          }
        }

        if (txRes.status === 'fulfilled' && txRes.value.ok) {
          const txData = await txRes.value.json();
          if (Array.isArray(txData) && txData.length > 0) {
            setTransactions(txData.map((t: any) => ({
              id: String(t.id),
              type: t.type,
              title: t.title,
              description: t.description,
              amount: parseFloat(t.amount),
              timestamp: t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : 'Hoje',
              dateCategory: 'Hoje',
              category: t.category,
              codeStatus: t.codeStatus || undefined,
              barcode: t.barcode || undefined,
              recipient: t.recipientName ? {
                name: t.recipientName,
                key: t.recipientKey,
                bank: t.recipientBank,
              } : undefined,
            })));
          }
        }
      } catch (err) {
        // Fallback to local storage state
      }
    };

    fetchDbData();
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prev => !prev);
  };

  const resetDemo = () => {
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    localStorage.setItem('bh_registered_users', JSON.stringify(INITIAL_REGISTERED_USERS));
    setAccount(INITIAL_ACCOUNT);
    setTransactions(INITIAL_TRANSACTIONS);
    setContacts(INITIAL_CONTACTS);
    setUserPixKeys(INITIAL_USER_KEYS);
    setSession({
      isAuthenticated: true,
      email: DEFAULT_CREDENTIALS.email,
      name: DEFAULT_CREDENTIALS.name,
      rememberMe: true,
      lastLogin: 'Hoje, 09:15',
    });
    setCurrentView('home');
    setActiveReceipt(null);
    setLastActionNotice(null);
    setSelectedContactForPix(null);
  };

  const sendPix = (recipientName: string, key: string, keyType: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, error: 'Valor deve ser superior a zero.' };
    }
    if (amount > account.balance) {
      return { success: false, error: 'Saldo insuficiente para esta transação.' };
    }

    const newTx: Transaction = {
      id: `pix-${Date.now()}`,
      type: 'pix_sent',
      title: recipientName || 'Transferência Pix',
      description: `Pix enviado (${keyType})`,
      amount: -amount,
      timestamp: 'Agora mesmo',
      dateCategory: 'Hoje',
      recipient: {
        name: recipientName || 'Destinatário Pix',
        key: key || 'Chave cadastrada',
        bank: 'Instituição Financeira Destino',
        document: '***.***.***-**'
      },
      category: 'Transferências',
      codeStatus: 'TX_PIX_OUT_200_EXEC',
    };

    setAccount(prev => ({
      ...prev,
      balance: Math.round((prev.balance - amount) * 100) / 100,
    }));

    setTransactions(prev => [newTx, ...prev]);

    // Async sync with Cloud SQL PostgreSQL backend
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: newTx.type,
        title: newTx.title,
        description: newTx.description,
        amount: newTx.amount,
        category: newTx.category,
        codeStatus: newTx.codeStatus,
        recipientName: newTx.recipient?.name,
        recipientKey: newTx.recipient?.key,
        recipientBank: newTx.recipient?.bank,
      }),
    }).catch(() => {});

    if (ihcMode === 'flawed') {
      setCurrentView('home');
      setLastActionNotice(null);
      setActiveReceipt(null);
    } else {
      setActiveReceipt(newTx);
      setLastActionNotice(`Pix de R$ ${amount.toFixed(2)} enviado com sucesso para ${recipientName}!`);
    }

    return { success: true };
  };

  const payBill = (description: string, barcode: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, error: 'Valor da fatura inválido.' };
    }
    if (amount > account.balance) {
      return { success: false, error: 'Saldo insuficiente para pagamento.' };
    }

    const newTx: Transaction = {
      id: `pay-${Date.now()}`,
      type: 'payment',
      title: description || 'Pagamento de Título',
      description: 'Liquidação de boleto bancário',
      amount: -amount,
      timestamp: 'Agora mesmo',
      dateCategory: 'Hoje',
      barcode: barcode || '34191.79001 01043.510047 91020.150008 8 9988000000',
      category: 'Serviços',
      codeStatus: 'OP_TIT_LIQUIDADO_OK',
    };

    setAccount(prev => ({
      ...prev,
      balance: Math.round((prev.balance - amount) * 100) / 100,
    }));

    setTransactions(prev => [newTx, ...prev]);

    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: newTx.type,
        title: newTx.title,
        description: newTx.description,
        amount: newTx.amount,
        category: newTx.category,
        codeStatus: newTx.codeStatus,
        barcode: newTx.barcode,
      }),
    }).catch(() => {});

    if (ihcMode === 'flawed') {
      setLastActionNotice('Solicitação concluída');
      setTimeout(() => setLastActionNotice(null), 2500);
      setCurrentView('home');
    } else {
      setActiveReceipt(newTx);
      setLastActionNotice(`Boleto de R$ ${amount.toFixed(2)} quitado com sucesso!`);
    }

    return { success: true };
  };

  const transferMoney = (recipientName: string, bank: string, agency: string, acc: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, error: 'Valor inválido.' };
    }
    if (amount > account.balance) {
      return { success: false, error: 'Saldo insuficiente.' };
    }

    const newTx: Transaction = {
      id: `ted-${Date.now()}`,
      type: 'transfer_out',
      title: recipientName || 'Transferência Bancária',
      description: `TED para ${bank} (Ag ${agency} / Conta ${acc})`,
      amount: -amount,
      timestamp: 'Agora mesmo',
      dateCategory: 'Hoje',
      recipient: {
        name: recipientName,
        bank: bank,
      },
      category: 'Transferências',
      codeStatus: 'TED_EXT_EXEC_SUCCESS',
    };

    setAccount(prev => ({
      ...prev,
      balance: Math.round((prev.balance - amount) * 100) / 100,
    }));

    setTransactions(prev => [newTx, ...prev]);

    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: newTx.type,
        title: newTx.title,
        description: newTx.description,
        amount: newTx.amount,
        category: newTx.category,
        codeStatus: newTx.codeStatus,
        recipientName: newTx.recipient?.name,
        recipientBank: newTx.recipient?.bank,
      }),
    }).catch(() => {});

    if (ihcMode === 'flawed') {
      setLastActionNotice('Operação processada');
      setTimeout(() => setLastActionNotice(null), 2500);
      setCurrentView('home');
    } else {
      setActiveReceipt(newTx);
      setLastActionNotice(`Transferência de R$ ${amount.toFixed(2)} realizada com sucesso.`);
    }

    return { success: true };
  };

  // CRUD Operations: Contacts (Favorecidos)
  const addContact = (data: Omit<Contact, 'id' | 'createdAt'>) => {
    if (!data.name.trim() || !data.key.trim()) {
      return { success: false, error: 'Nome e chave são campos obrigatórios.' };
    }

    const newContact: Contact = {
      ...data,
      id: `ct-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setContacts(prev => [newContact, ...prev]);

    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    if (ihcMode === 'flawed') {
      setLastActionNotice('Registro gravado');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice(`Contato "${newContact.name}" adicionado com sucesso!`);
      setTimeout(() => setLastActionNotice(null), 3000);
    }

    return { success: true, contact: newContact };
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    let updatedName = '';
    setContacts(prev =>
      prev.map(c => {
        if (c.id === id) {
          updatedName = updates.name || c.name;
          return { ...c, ...updates };
        }
        return c;
      })
    );

    const numericId = parseInt(id.replace('ct-', ''));
    if (!isNaN(numericId)) {
      fetch(`/api/contacts/${numericId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    }

    if (ihcMode === 'flawed') {
      setLastActionNotice('Atualização executada');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice(`Contato "${updatedName}" atualizado com sucesso!`);
      setTimeout(() => setLastActionNotice(null), 3000);
    }

    return { success: true };
  };

  const deleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));

    const numericId = parseInt(id.replace('ct-', ''));
    if (!isNaN(numericId)) {
      fetch(`/api/contacts/${numericId}`, {
        method: 'DELETE',
      }).catch(() => {});
    }

    if (ihcMode === 'flawed') {
      setLastActionNotice('Item removido');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice(`Contato "${contactToDelete?.name || ''}" excluído com sucesso.`);
      setTimeout(() => setLastActionNotice(null), 3000);
    }

    return { success: true };
  };

  // CRUD Operations: Minhas Chaves Pix
  const addUserPixKey = (key: string, keyType: PixKeyType, label: string) => {
    if (!key.trim()) {
      return { success: false, error: 'Chave não pode ser vazia.' };
    }

    if (userPixKeys.some(k => k.key.toLowerCase() === key.toLowerCase())) {
      return { success: false, error: 'Esta chave Pix já está cadastrada na sua conta.' };
    }

    const newKey: UserPixKey = {
      id: `key-${Date.now()}`,
      key: key.trim(),
      keyType,
      label: label.trim() || `Chave ${keyType}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setUserPixKeys(prev => [newKey, ...prev]);

    fetch('/api/pix-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, keyType, label }),
    }).catch(() => {});

    if (ihcMode === 'flawed') {
      setLastActionNotice('Chave registrada');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice(`Nova chave Pix (${keyType}) registrada com sucesso!`);
      setTimeout(() => setLastActionNotice(null), 3000);
    }

    return { success: true };
  };

  const deleteUserPixKey = (id: string) => {
    const keyToDelete = userPixKeys.find(k => k.id === id);
    setUserPixKeys(prev => prev.filter(k => k.id !== id));

    const numericId = parseInt(id.replace('key-', ''));
    if (!isNaN(numericId)) {
      fetch(`/api/pix-keys/${numericId}`, {
        method: 'DELETE',
      }).catch(() => {});
    }

    if (ihcMode === 'flawed') {
      setLastActionNotice('Registro eliminado');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice(`Chave Pix "${keyToDelete?.label || keyToDelete?.key}" excluída com sucesso.`);
      setTimeout(() => setLastActionNotice(null), 3000);
    }

    return { success: true };
  };

  const login = (email: string, password: string, rememberMe: boolean = true) => {
    const cleanEmail = email.trim().toLowerCase();

    if (ihcMode === 'flawed') {
      // INTENTIONAL IHC FLAWS:
      // Cryptic machine errors, no constructive guidance (Heuristic #9)
      if (!cleanEmail.includes('@') || !cleanEmail.endsWith('@gmail.com')) {
        return { success: false, error: 'ERR_400_DOM_PARSE: Identificador de domínio inválido.' };
      }

      // STRICT VALIDATION: Check if user exists among registered users
      const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return { success: false, error: 'ERR_404_USER_NOT_REGISTERED: Conta de usuário não localizada na base cadastral.' };
      }

      if (user.password && password !== user.password) {
        return { success: false, error: 'ERRO_401_AUTH: CREDENTIALS_HASH_MISMATCH_REJECTED.' };
      }

      if (password.length < 4) {
        return { success: false, error: 'SUBMISSÃO DE AUTENTICAÇÃO REJEITADA PELO CONTROLADOR.' };
      }

      setSession({
        isAuthenticated: true,
        email: user.email,
        name: user.name,
        rememberMe,
        lastLogin: 'Agora mesmo',
      });

      setAccount(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        agency: user.agency || '0001',
        account: user.account,
        balance: user.balance,
        pixLimit: user.pixLimit || 3000,
      }));

      setLastActionNotice('Token gerado');
      setTimeout(() => setLastActionNotice(null), 2000);
      return { success: true };
    } else {
      // IMPROVED MODE:
      // High usability, constructive error guidance (Heuristics #5 & #9)
      if (!cleanEmail) {
        return { success: false, error: 'Por favor, informe seu endereço de e-mail do Gmail.' };
      }

      if (!cleanEmail.endsWith('@gmail.com')) {
        return { success: false, error: 'Utilize sua conta do Gmail terminando em @gmail.com.' };
      }

      if (!password) {
        return { success: false, error: 'Digite sua senha cadastrada.' };
      }

      // STRICT VALIDATION: Check if user exists among registered users
      const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return { 
          success: false, 
          error: 'Usuário não cadastrado. Este endereço de Gmail não possui conta no Banco Horizonte. Verifique a digitação ou clique em "Criar Conta" para se cadastrar.' 
        };
      }

      if (user.password && password !== user.password) {
        return { 
          success: false, 
          error: `Senha incorreta para a conta de ${user.name}. Verifique a senha digitada ou se o Caps Lock está ativado.` 
        };
      }

      setSession({
        isAuthenticated: true,
        email: user.email,
        name: user.name,
        rememberMe,
        lastLogin: 'Agora mesmo',
      });

      setAccount(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        agency: user.agency || '0001',
        account: user.account,
        balance: user.balance,
        pixLimit: user.pixLimit || 3000,
      }));

      // Async sync with Cloud SQL backend
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password }),
      }).catch(() => {});

      setLastActionNotice(`Bem-vindo(a) de volta ao Banco Horizonte, ${user.name}!`);
      setTimeout(() => setLastActionNotice(null), 3500);
      return { success: true };
    }
  };

  const registerUser = async (name: string, email: string, password: string, initialBalance: number = 1500) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: 'Por favor, informe seu nome completo.' };
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      return { success: false, error: 'O cadastro requer um e-mail do Gmail terminando em @gmail.com.' };
    }

    if (!password || password.length < 4) {
      return { success: false, error: 'A senha deve conter no mínimo 4 caracteres.' };
    }

    if (registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Este e-mail já possui cadastro no Banco Horizonte. Faça login diretamente.' };
    }

    const randomAccount = `${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1 + Math.random() * 9)}`;

    const newUser: RegisteredUser = {
      name: cleanName,
      email: cleanEmail,
      password,
      agency: '0001',
      account: randomAccount,
      balance: initialBalance,
      pixLimit: 3000.00,
    };

    setRegisteredUsers(prev => [...prev, newUser]);

    // Persist to Cloud SQL PostgreSQL backend
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          initialBalance,
        }),
      });
    } catch (e) {
      // offline fallback
    }

    setLastActionNotice(`Conta de ${cleanName} criada com sucesso! Faça login com suas credenciais.`);
    setTimeout(() => setLastActionNotice(null), 4000);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setSession(prev => ({ ...prev, isAuthenticated: false }));
    setCurrentView('home');
    if (ihcMode === 'flawed') {
      setLastActionNotice('Sessão encerrada');
      setTimeout(() => setLastActionNotice(null), 2000);
    } else {
      setLastActionNotice('Você encerrou a sessão com segurança.');
      setTimeout(() => setLastActionNotice(null), 3000);
    }
  };

  const quickDemoLogin = () => {
    login(DEFAULT_CREDENTIALS.email, DEFAULT_CREDENTIALS.password, true);
  };

  return (
    <BankContext.Provider
      value={{
        account,
        transactions,
        contacts,
        userPixKeys,
        session,
        registeredUsers,
        login,
        registerUser,
        logout,
        quickDemoLogin,
        currentView,
        setCurrentView,
        ihcMode,
        setIhcMode,
        isBalanceVisible,
        toggleBalanceVisibility,
        deviceMode,
        setDeviceMode,
        isPresenterModalOpen,
        setIsPresenterModalOpen,
        activeReceipt,
        setActiveReceipt,
        lastActionNotice,
        setLastActionNotice,
        selectedContactForPix,
        setSelectedContactForPix,
        sendPix,
        payBill,
        transferMoney,
        resetDemo,
        addContact,
        updateContact,
        deleteContact,
        addUserPixKey,
        deleteUserPixKey,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
