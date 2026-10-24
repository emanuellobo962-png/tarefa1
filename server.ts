import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import { users, transactions, contacts, userPixKeys } from './src/db/schema.ts';
import { eq, desc, sql } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'PostgreSQL Cloud SQL' });
});

// Helper to get active user by header or query param
async function getTargetUser(req: express.Request) {
  const emailHeader = (req.headers['x-user-email'] as string) || (req.query.email as string);
  if (emailHeader && typeof emailHeader === 'string' && emailHeader.trim()) {
    const cleanEmail = emailHeader.trim().toLowerCase();
    const found = await db.select().from(users).where(sql`LOWER(${users.email}) = ${cleanEmail}`).limit(1);
    if (found.length > 0) return found[0];
  }
  const defaultList = await db.select().from(users).limit(1);
  return defaultList[0] || null;
}

// Auth: Login endpoint with strict verification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'E-mail e senha são obrigatórios.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const userList = await db.select().from(users).where(sql`LOWER(${users.email}) = ${cleanEmail}`).limit(1);

    if (userList.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não cadastrado. Este endereço de e-mail não possui conta no Banco Horizonte.'
      });
    }

    const user = userList[0];
    if (user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Senha incorreta para o e-mail informado. Verifique suas credenciais.'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        agency: user.agency,
        account: user.account,
        balance: parseFloat(user.balance),
        pixLimit: parseFloat(user.pixLimit),
      }
    });
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ success: false, error: 'Falha interna na autenticação.' });
  }
});

// Auth: Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password, initialBalance } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Nome, Gmail e senha são obrigatórios.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com')) {
      return res.status(400).json({ success: false, error: 'O cadastro requer um endereço @gmail.com.' });
    }

    const existing = await db.select().from(users).where(sql`LOWER(${users.email}) = ${cleanEmail}`).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Este e-mail já está cadastrado no sistema.' });
    }

    const randomAccount = `${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1 + Math.random() * 9)}`;
    const startingBalance = initialBalance !== undefined ? parseFloat(initialBalance).toFixed(2) : '1500.00';
    const uid = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const inserted = await db.insert(users).values({
      uid,
      email: cleanEmail,
      name: String(name).trim(),
      password: String(password),
      agency: '0001',
      account: randomAccount,
      balance: startingBalance,
      pixLimit: '3000.00',
    }).returning();

    const newUser = inserted[0];
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        agency: newUser.agency,
        account: newUser.account,
        balance: parseFloat(newUser.balance),
        pixLimit: parseFloat(newUser.pixLimit),
      }
    });
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar novo usuário.' });
  }
});

// Auth: List registered users (public details only)
app.get('/api/auth/registered-users', async (req, res) => {
  try {
    const userList = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      agency: users.agency,
      account: users.account,
      balance: users.balance,
      pixLimit: users.pixLimit,
    }).from(users);
    res.json(userList);
  } catch (error: any) {
    console.error('Error fetching registered users:', error);
    res.status(500).json({ error: 'Failed to fetch registered users' });
  }
});

// Get user account
app.get('/api/account', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.json([]);
    const txList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt));
    res.json(txList);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction (Pix, Payment, Transfer)
app.post('/api/transactions', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { type, title, description, amount, category, codeStatus, recipientName, recipientKey, recipientBank, barcode } = req.body;
    const numAmount = parseFloat(amount);

    // Update balance
    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + numAmount).toFixed(2);

    await db.update(users).set({ balance: newBalance }).where(eq(users.id, user.id));

    const inserted = await db.insert(transactions).values({
      userId: user.id,
      type,
      title,
      description,
      amount: numAmount.toFixed(2),
      category,
      codeStatus,
      recipientName,
      recipientKey,
      recipientBank,
      barcode,
    }).returning();

    res.status(201).json({ transaction: inserted[0], newBalance });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

// CRUD Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.json([]);
    const contactList = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, user.id))
      .orderBy(desc(contacts.createdAt));
    res.json(contactList);
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, nickname, key, keyType, bank, agency, account, notes } = req.body;
    const inserted = await db.insert(contacts).values({
      userId: user.id,
      name,
      nickname,
      key,
      keyType,
      bank,
      agency,
      account,
      notes,
    }).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nickname, key, keyType, bank, agency, account, notes } = req.body;
    const updated = await db.update(contacts).set({
      name,
      nickname,
      key,
      keyType,
      bank,
      agency,
      account,
      notes,
    }).where(eq(contacts.id, id)).returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(contacts).where(eq(contacts.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// CRUD Pix Keys
app.get('/api/pix-keys', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.json([]);
    const keysList = await db.select().from(userPixKeys).where(eq(userPixKeys.userId, user.id));
    res.json(keysList);
  } catch (error: any) {
    console.error('Error fetching pix keys:', error);
    res.status(500).json({ error: 'Failed to fetch pix keys' });
  }
});

app.post('/api/pix-keys', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { key, keyType, label } = req.body;
    const inserted = await db.insert(userPixKeys).values({
      userId: user.id,
      key,
      keyType,
      label,
    }).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Error creating pix key:', error);
    res.status(500).json({ error: 'Failed to create pix key' });
  }
});

app.delete('/api/pix-keys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(userPixKeys).where(eq(userPixKeys.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pix key:', error);
    res.status(500).json({ error: 'Failed to delete pix key' });
  }
});

// Vite middleware in dev or static in prod
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve('dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Banco Horizonte Server running on http://0.0.0.0:${PORT}`);
});
