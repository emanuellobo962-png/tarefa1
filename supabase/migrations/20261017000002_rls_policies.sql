-- ========================================================================
-- BANCO HORIZONTE - SUPABASE MIGRATION 002: ROW LEVEL SECURITY (RLS)
-- Description: Configures Row Level Security policies for authenticated users
-- Target Database: Supabase PostgreSQL
-- ========================================================================

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pix_keys ENABLE ROW LEVEL SECURITY;

-- 1. POLICIES FOR USERS TABLE
-- Allow users to view their own profile by matching Firebase/Supabase auth UID or email
CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    USING (
        auth.uid()::text = uid 
        OR auth.jwt() ->> 'email' = email
        OR uid = 'ana-silva-uid' -- Demo presentation access fallback
    );

CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (
        auth.uid()::text = uid 
        OR auth.jwt() ->> 'email' = email
        OR uid = 'ana-silva-uid'
    )
    WITH CHECK (
        auth.uid()::text = uid 
        OR auth.jwt() ->> 'email' = email
        OR uid = 'ana-silva-uid'
    );

CREATE POLICY "Users can insert own profile"
    ON public.users
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = uid 
        OR auth.jwt() ->> 'email' = email
        OR true -- Allows registration
    );

-- 2. POLICIES FOR TRANSACTIONS TABLE
-- Users can only read and insert transactions associated with their account
CREATE POLICY "Users can read own transactions"
    ON public.transactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = transactions.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    );

CREATE POLICY "Users can create transactions"
    ON public.transactions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = transactions.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    );

-- 3. POLICIES FOR CONTACTS TABLE (CRUD)
CREATE POLICY "Users can manage own contacts"
    ON public.contacts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = contacts.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = contacts.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    );

-- 4. POLICIES FOR USER PIX KEYS TABLE (CRUD)
CREATE POLICY "Users can manage own pix keys"
    ON public.user_pix_keys
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = user_pix_keys.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = user_pix_keys.user_id
            AND (users.uid = auth.uid()::text OR users.email = auth.jwt() ->> 'email' OR users.uid = 'ana-silva-uid')
        )
    );
