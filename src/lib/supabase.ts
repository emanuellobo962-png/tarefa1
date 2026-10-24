import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key'
);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const getSupabaseConfig = () => ({
  url: supabaseUrl || 'Não configurado (ex: https://xyz.supabase.co)',
  isConfigured: isSupabaseConfigured,
  hasAnonKey: Boolean(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key'),
});
