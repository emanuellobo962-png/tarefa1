import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import type { Database } from '../types/supabase.ts';

type ContactRow = Database['public']['Tables']['contacts']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type UserPixKeyRow = Database['public']['Tables']['user_pix_keys']['Row'];

/**
 * Service for interacting directly with Supabase when configured
 */
export const supabaseService = {
  isConfigured: () => isSupabaseConfigured,

  // Fetch account data
  async getAccount(userEmail = 'ana.silva@gmail.com') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();

    if (error) {
      console.warn('Supabase getAccount error:', error.message);
      return null;
    }
    return data;
  },

  // Fetch contacts
  async getContacts(userId?: number) {
    if (!supabase) return [];
    let query = supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getContacts error:', error.message);
      return [];
    }
    return data as ContactRow[];
  },

  // Add contact
  async addContact(contact: {
    userId: number;
    name: string;
    nickname?: string;
    key: string;
    keyType: string;
    bank: string;
    agency?: string;
    account?: string;
    notes?: string;
  }) {
    if (!supabase) return null;
    const { data, error } = await (supabase.from('contacts') as any)
      .insert({
        user_id: contact.userId,
        name: contact.name,
        nickname: contact.nickname || null,
        key: contact.key,
        key_type: contact.keyType,
        bank: contact.bank,
        agency: contact.agency || null,
        account: contact.account || null,
        notes: contact.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase addContact error:', error.message);
      return null;
    }
    return data;
  },

  // Delete contact
  async deleteContact(id: number) {
    if (!supabase) return false;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    return !error;
  },

  // Fetch transactions
  async getTransactions(userId?: number) {
    if (!supabase) return [];
    let query = supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getTransactions error:', error.message);
      return [];
    }
    return data as TransactionRow[];
  },

  // Fetch user Pix keys
  async getPixKeys(userId?: number) {
    if (!supabase) return [];
    let query = supabase.from('user_pix_keys').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getPixKeys error:', error.message);
      return [];
    }
    return data as UserPixKeyRow[];
  },
};
