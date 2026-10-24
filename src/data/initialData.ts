import { Transaction, UserAccount, Contact, UserPixKey, RegisteredUser } from '../types';

export const DEFAULT_CREDENTIALS = {
  email: 'ana.silva@gmail.com',
  password: 'senha123',
  name: 'Ana Carolina Silva',
};

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  {
    email: 'ana.silva@gmail.com',
    password: 'senha123',
    name: 'Ana Carolina Silva',
    agency: '0001',
    account: '984712-3',
    balance: 1250.00,
    pixLimit: 3000.00,
  }
];

export const INITIAL_ACCOUNT: UserAccount = {
  name: 'Ana Carolina Silva',
  email: 'ana.silva@gmail.com',
  agency: '0001',
  account: '984712-3',
  balance: 1250.00,
  initialBalance: 1250.00,
  pixLimit: 3000.00,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'card_debit',
    title: 'Mercado Pão Dourado',
    description: 'Compra no débito à vista',
    amount: -84.50,
    timestamp: 'Hoje, às 14:22',
    dateCategory: 'Hoje',
    category: 'Alimentação',
    codeStatus: 'OPR_DBT_APPROVED_200',
  },
  {
    id: 'tx-002',
    type: 'pix_received',
    title: 'Carlos Eduardo Lima',
    description: 'Transferência Pix recebida',
    amount: 350.00,
    timestamp: 'Hoje, às 10:15',
    dateCategory: 'Hoje',
    recipient: {
      name: 'Carlos Eduardo Lima',
      key: 'carlos.lima@email.com',
      bank: 'Banco Horizon',
      document: '***.482.910-**'
    },
    category: 'Transferências',
    codeStatus: 'PIX_IN_CRD_019',
  },
  {
    id: 'tx-003',
    type: 'card_debit',
    title: 'Farmácia Bem Estar',
    description: 'Medicamentos e higiene',
    amount: -62.30,
    timestamp: 'Ontem, às 18:40',
    dateCategory: 'Ontem',
    category: 'Saúde',
    codeStatus: 'OPR_DBT_APPROVED_200',
  },
  {
    id: 'tx-004',
    type: 'payment',
    title: 'Assinatura StreamPlus',
    description: 'Débito automático mensalidade',
    amount: -39.90,
    timestamp: 'Ontem, às 08:00',
    dateCategory: 'Ontem',
    category: 'Lazer',
    codeStatus: 'AUTO_DEBIT_EXEC_001',
  },
  {
    id: 'tx-005',
    type: 'salary',
    title: 'TechSoluções Digitais Ltda',
    description: 'Crédito de proventos / Salário',
    amount: 3800.00,
    timestamp: '05 Out, às 06:12',
    dateCategory: 'Este mês',
    category: 'Salário',
    codeStatus: 'FOLHA_CRED_TED_883',
  },
  {
    id: 'tx-006',
    type: 'payment',
    title: 'Companhia Elétrica LightNet',
    description: 'Pagamento de conta de consumo',
    amount: -185.40,
    timestamp: '02 Out, às 11:30',
    dateCategory: 'Este mês',
    category: 'Serviços',
    codeStatus: 'CONV_ARRECAD_772',
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'ct-001',
    name: 'Marcos Oliveira',
    nickname: 'Marcão Apê',
    key: '123.456.789-00',
    keyType: 'CPF',
    bank: 'Banco Horizonte',
    agency: '0001',
    account: '12345-6',
    notes: 'Divisão de aluguel e despesas do apartamento',
    createdAt: '10/09/2026',
  },
  {
    id: 'ct-002',
    name: 'Mariana Souza',
    nickname: 'Mari Designer',
    key: 'mariana.souza@email.com',
    keyType: 'E-mail',
    bank: 'Nubank Pagamentos S.A.',
    notes: 'Freelancer de identidade visual e UI',
    createdAt: '15/09/2026',
  },
  {
    id: 'ct-003',
    name: 'Lucas Pereira',
    nickname: 'Lucas Irmão',
    key: '+55 11 98765-4321',
    keyType: 'Celular',
    bank: '001 - Banco do Brasil S.A.',
    agency: '4321',
    account: '98765-0',
    notes: 'Transferências familiares',
    createdAt: '01/10/2026',
  },
  {
    id: 'ct-004',
    name: 'Padaria Sabor Real Ltda',
    nickname: 'Padaria da Esquina',
    key: '12.345.678/0001-90',
    keyType: 'CNPJ',
    bank: '341 - Itaú Unibanco S.A.',
    notes: 'Lanches e encomendas semanais',
    createdAt: '05/10/2026',
  },
];

export const INITIAL_USER_KEYS: UserPixKey[] = [
  {
    id: 'key-001',
    key: 'ana.silva@horizonte.com.br',
    keyType: 'E-mail',
    label: 'E-mail Principal',
    createdAt: '12/01/2026',
  },
  {
    id: 'key-002',
    key: '482.910.371-55',
    keyType: 'CPF',
    label: 'Chave CPF Pessoal',
    createdAt: '14/01/2026',
  },
  {
    id: 'key-003',
    key: 'c9f872b1-4190-449e-b992-df63a5e81099',
    keyType: 'Aleatória',
    label: 'Chave Aleatória de Cobrança',
    createdAt: '03/05/2026',
  },
];

export const FREQUENT_CONTACTS = INITIAL_CONTACTS.map(c => ({
  name: c.name,
  key: c.key,
  bank: c.bank,
  type: c.keyType
}));

