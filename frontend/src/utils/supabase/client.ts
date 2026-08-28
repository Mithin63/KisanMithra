import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://dvllgekdtbhjjvznybcb.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vtxHK1_FHzJMo8cOatQs-w_Hd3wCAav';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
