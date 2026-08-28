import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL)
  || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL)
  || 'https://dvllgekdtbhjjvznybcb.supabase.co';

const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY)
  || 'sb_publishable_vtxHK1_FHzJMo8cOatQs-w_Hd3wCAav';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
