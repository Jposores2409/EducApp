import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://kkqamahqoynwsokylgzj.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key_for_build_step';

export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;
  return createClient(url, key);
};