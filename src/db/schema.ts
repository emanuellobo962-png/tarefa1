import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or unique user identifier
  email: text('email').notNull(),
  password: text('password').default('senha123'),
  name: text('name').notNull(),
  agency: text('agency').notNull().default('0001'),
  account: text('account').notNull().default('984712-3'),
  balance: numeric('balance', { precision: 12, scale: 2 }).notNull().default('1250.00'),
  pixLimit: numeric('pix_limit', { precision: 12, scale: 2 }).notNull().default('3000.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  category: text('category').notNull(),
  codeStatus: text('code_status'),
  recipientName: text('recipient_name'),
  recipientKey: text('recipient_key'),
  recipientBank: text('recipient_bank'),
  barcode: text('barcode'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contacts table (Favorecidos Pix CRUD)
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  nickname: text('nickname'),
  key: text('key').notNull(),
  keyType: text('key_type').notNull(),
  bank: text('bank').notNull(),
  agency: text('agency'),
  account: text('account'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Pix Keys table (Minhas Chaves Pix CRUD)
export const userPixKeys = pgTable('user_pix_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  key: text('key').notNull().unique(),
  keyType: text('key_type').notNull(),
  label: text('label').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  contacts: many(contacts),
  pixKeys: many(userPixKeys),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
}));

export const userPixKeysRelations = relations(userPixKeys, ({ one }) => ({
  user: one(users, {
    fields: [userPixKeys.userId],
    references: [users.id],
  }),
}));
