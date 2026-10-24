export type TransactionType = 'pix_sent' | 'pix_received' | 'payment' | 'transfer_out' | 'transfer_in' | 'card_debit' | 'salary';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number; // negative for expense, positive for credit
  timestamp: string; // ISO date string or formatted
  dateCategory: 'Hoje' | 'Ontem' | 'Esta semana' | 'Este mês' | 'Anterior';
  recipient?: {
    name: string;
    key?: string;
    bank?: string;
    document?: string;
  };
  barcode?: string;
  category: 'Alimentação' | 'Transferências' | 'Serviços' | 'Salário' | 'Saúde' | 'Lazer';
  codeStatus?: string; // used for technical jargon in flawed mode
}

export type ViewType = 'home' | 'pix' | 'payments' | 'transfers' | 'statement' | 'contacts' | 'settings';

export type IhcMode = 'flawed' | 'improved';

export interface RegisteredUser {
  id?: number | string;
  email: string;
  password?: string;
  name: string;
  agency: string;
  account: string;
  balance: number;
  pixLimit: number;
}

export interface UserSession {
  isAuthenticated: boolean;
  email: string;
  name: string;
  rememberMe: boolean;
  lastLogin: string;
}

export interface UserAccount {
  name: string;
  email: string;
  agency: string;
  account: string;
  balance: number;
  pixLimit: number;
  initialBalance: number;
}

export type PixKeyType = 'CPF' | 'E-mail' | 'Celular' | 'Aleatória' | 'CNPJ';

export interface Contact {
  id: string;
  name: string;
  nickname?: string;
  key: string;
  keyType: PixKeyType;
  bank: string;
  agency?: string;
  account?: string;
  notes?: string;
  createdAt: string;
}

export interface UserPixKey {
  id: string;
  key: string;
  keyType: PixKeyType;
  label: string;
  createdAt: string;
}
