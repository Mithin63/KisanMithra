import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://dvllgekdtbhjjvznybcb.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vtxHK1_FHzJMo8cOatQs-w_Hd3wCAav';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
