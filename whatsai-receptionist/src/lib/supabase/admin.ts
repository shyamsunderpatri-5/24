import { createClient } from '@supabase/supabase-js';

// Service role client: Bypasses RLS. NEVER USE ON CLIENT.
// Use this inside webhooks and edge functions where we don't have a user session contexts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
