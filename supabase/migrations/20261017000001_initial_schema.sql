-- ========================================================================
-- BANCO HORIZONTE - SUPABASE MIGRATION 001: INITIAL SCHEMA
-- Description: Creates core banking tables (users, transactions, contacts, user_pix_keys)
-- Target Database: Supabase PostgreSQL (15+)
-- ========================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    agency TEXT NOT NULL DEFAULT '0001',
    account TEXT NOT NULL DEFAULT '984712-3',
    balance NUMERIC(12, 2) NOT NULL DEFAULT 1250.00,
    pix_limit NUMERIC(12, 2) NOT NULL DEFAULT 3000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'pix_sent', 'pix_received', 'payment', 'transfer_out', 'card_debit', 'salary'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category TEXT NOT NULL, -- 'Alimentação', 'Transferências', 'Serviços', 'Salário', 'Saúde', 'Lazer'
    code_status TEXT,
    recipient_name TEXT,
    recipient_key TEXT,
    recipient_bank TEXT,
    barcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CONTACTS TABLE (Agenda de Favorecidos Pix - CRUD)
CREATE TABLE IF NOT EXISTS public.contacts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    nickname TEXT,
    key TEXT NOT NULL,
    key_type TEXT NOT NULL, -- 'CPF', 'E-mail', 'Celular', 'Aleatória', 'CNPJ'
    bank TEXT NOT NULL,
    agency TEXT,
    account TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. USER PIX KEYS TABLE (Minhas Chaves Pix - CRUD)
CREATE TABLE IF NOT EXISTS public.user_pix_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    key TEXT NOT NULL UNIQUE,
    key_type TEXT NOT NULL, -- 'CPF', 'E-mail', 'Celular', 'Aleatória'
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pix_keys_user_id ON public.user_pix_keys(user_id);
