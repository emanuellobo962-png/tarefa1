export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          uid: string;
          email: string;
          name: string;
          agency: string;
          account: string;
          balance: number;
          pix_limit: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          uid: string;
          email: string;
          name: string;
          agency?: string;
          account?: string;
          balance?: number;
          pix_limit?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          uid?: string;
          email?: string;
          name?: string;
          agency?: string;
          account?: string;
          balance?: number;
          pix_limit?: number;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: number;
          user_id: number;
          type: string;
          title: string;
          description: string;
          amount: number;
          category: string;
          code_status: string | null;
          recipient_name: string | null;
          recipient_key: string | null;
          recipient_bank: string | null;
          barcode: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          type: string;
          title: string;
          description: string;
          amount: number;
          category: string;
          code_status?: string | null;
          recipient_name?: string | null;
          recipient_key?: string | null;
          recipient_bank?: string | null;
          barcode?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          type?: string;
          title?: string;
          description?: string;
          amount?: number;
          category?: string;
          code_status?: string | null;
          recipient_name?: string | null;
          recipient_key?: string | null;
          recipient_bank?: string | null;
          barcode?: string | null;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: number;
          user_id: number;
          name: string;
          nickname: string | null;
          key: string;
          key_type: string;
          bank: string;
          agency: string | null;
          account: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          name: string;
          nickname?: string | null;
          key: string;
          key_type: string;
          bank: string;
          agency?: string | null;
          account?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          name?: string;
          nickname?: string | null;
          key?: string;
          key_type?: string;
          bank?: string;
          agency?: string | null;
          account?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      user_pix_keys: {
        Row: {
          id: number;
          user_id: number;
          key: string;
          key_type: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          key: string;
          key_type: string;
          label: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          key?: string;
          key_type?: string;
          label?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
