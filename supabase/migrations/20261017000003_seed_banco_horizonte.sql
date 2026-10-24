-- ========================================================================
-- BANCO HORIZONTE - SUPABASE MIGRATION 003: SEED DATA
-- Description: Seeds default user account, transactions, contacts, and Pix keys
-- Target Database: Supabase PostgreSQL
-- ========================================================================

-- Insert default user Ana Carolina Silva if not already present
INSERT INTO public.users (uid, email, name, agency, account, balance, pix_limit)
VALUES (
    'ana-silva-uid',
    'ana.silva@gmail.com',
    'Ana Carolina Silva',
    '0001',
    '984712-3',
    1250.00,
    3000.00
)
ON CONFLICT (uid) DO UPDATE
SET balance = 1250.00,
    pix_limit = 3000.00;

-- Retrieve Ana's user id and seed initial transactions
DO $$
DECLARE
    ana_id BIGINT;
BEGIN
    SELECT id INTO ana_id FROM public.users WHERE uid = 'ana-silva-uid' LIMIT 1;

    -- Delete prior demo transactions for clean idempotency if desired
    DELETE FROM public.transactions WHERE user_id = ana_id;

    -- Initial banking transactions
    INSERT INTO public.transactions (user_id, type, title, description, amount, category, code_status, recipient_name, recipient_key, recipient_bank, created_at)
    VALUES
    (ana_id, 'card_debit', 'Supermercado Central', 'Compra no débito à vista', -84.50, 'Alimentação', 'CONFIRMADO_SISTEMA', NULL, NULL, NULL, now() - INTERVAL '2 hours'),
    (ana_id, 'pix_received', 'Transferência Pix Recebida', 'Pix de Mariana Rocha Silva', 200.00, 'Transferências', 'TX_CONCLUIDA_882', 'Mariana Rocha Silva', 'mariana@email.com', 'Banco Inter S.A.', now() - INTERVAL '1 day'),
    (ana_id, 'payment', 'Pagamento de Boleto', 'Enel Distribuição Energia Elétrica', -142.30, 'Serviços', 'LIQUIDADO_CIP', NULL, NULL, NULL, now() - INTERVAL '2 days'),
    (ana_id, 'salary', 'Crédito de Salário', 'Empresa Exemplo S.A. Folha Mensal', 3200.00, 'Salário', 'TED_RECEBIDA_01', NULL, NULL, 'Banco do Brasil', now() - INTERVAL '5 days'),
    (ana_id, 'transfer_out', 'Transferência Enviada', 'Transferência bancária para Roberto', -350.00, 'Transferências', 'DOC_PROCESSADO', 'Roberto Carlos', NULL, 'Caixa Econômica', now() - INTERVAL '6 days');

    -- Seed initial contacts (Favorecidos Pix CRUD)
    DELETE FROM public.contacts WHERE user_id = ana_id;

    INSERT INTO public.contacts (user_id, name, nickname, key, key_type, bank, agency, account, notes, created_at)
    VALUES
    (ana_id, 'Carlos Alberto Mendes', 'Carlos Irmão', '123.456.789-00', 'CPF', 'Nubank', '0001', '1234567-8', 'Ajuda de custos familiar', now() - INTERVAL '10 days'),
    (ana_id, 'Beatriz Santos Lima', 'Bia Designer', 'beatriz.lima@email.com', 'E-mail', 'Banco Itaú', '1234', '98765-4', 'Freelance identidade visual', now() - INTERVAL '8 days'),
    (ana_id, 'Lucas Ferreira Souza', 'Lucas Academia', '(11) 98765-4321', 'Celular', 'Banco Inter', '0001', '554433-2', 'Mensalidade do treino', now() - INTERVAL '4 days'),
    (ana_id, 'Mariana Costa Tech', 'Fornecedor Tech', '12.345.678/0001-90', 'CNPJ', 'Banco C6', '0001', '998877-1', 'Serviço de hospedagem', now() - INTERVAL '2 days');

    -- Seed initial user Pix keys (Minhas Chaves Pix CRUD)
    DELETE FROM public.user_pix_keys WHERE user_id = ana_id;

    INSERT INTO public.user_pix_keys (user_id, key, key_type, label, created_at)
    VALUES
    (ana_id, 'ana.silva@gmail.com', 'E-mail', 'E-mail Principal', now() - INTERVAL '30 days'),
    (ana_id, '11999887766', 'Celular', 'WhatsApp Pessoal', now() - INTERVAL '20 days'),
    (ana_id, 'b8e91d84-4e20-4e02-9853-9182374619a0', 'Aleatória', 'Chave Segura Banco Central', now() - INTERVAL '5 days');

END $$;
