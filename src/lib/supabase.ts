import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'firstrank-public-auth', // For regular users
    persistSession: true,
    autoRefreshToken: true,
    multiTab: false, // Prevents hanging deadlocks
  }
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'firstrank-admin-auth', // For the admin dashboard
    persistSession: true,
    autoRefreshToken: true,
    multiTab: false, // Prevents hanging deadlocks
  }
});
