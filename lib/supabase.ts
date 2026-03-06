// Supabase Client Configuration
// This file initializes the Supabase client for both client-side and server-side operations
// Environment Variables Required (from .env.local):
// - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
// - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous key
// - SUPABASE_SERVICE_ROLE_KEY: Server-side service role key (for admin operations)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate that environment variables are configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not configured properly');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
}

// Client-side Supabase client (with row-level security)
// Used for frontend operations respecting RLS policies
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Server-side Supabase client (with service role key)
// ONLY used in API routes with SUPABASE_SERVICE_ROLE_KEY
// WARNING: Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '');

export default supabase;
