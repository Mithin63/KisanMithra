import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

/**
 * Logs a login/signin event to the Supabase `login_events` table.
 * The table is created lazily on first use via SQL if it doesn't exist.
 *
 * Table schema (auto-created on Supabase if not present):
 *   id          uuid primary key default gen_random_uuid()
 *   mobile      text
 *   email       text
 *   role        text  ('FARMER' | 'OFFICER' | 'ADMIN')
 *   event_type  text  ('LOGIN' | 'LOGOUT' | 'REGISTER')
 *   status      text  ('SUCCESS' | 'FAILED')
 *   ip_address  text  (optional, browser-side = null)
 *   user_agent  text
 *   created_at  timestamptz default now()
 */

export interface LoginEventPayload {
  mobile?: string;
  email?: string;
  role: UserRole;
  event_type: 'LOGIN' | 'LOGOUT' | 'REGISTER';
  status: 'SUCCESS' | 'FAILED';
  error_message?: string;
}

export const logLoginEvent = async (payload: LoginEventPayload): Promise<void> => {
  try {
    const { error } = await supabase
      .from('login_events')
      .insert([
        {
          mobile: payload.mobile || null,
          email: payload.email || null,
          role: payload.role,
          event_type: payload.event_type,
          status: payload.status,
          error_message: payload.error_message || null,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      // Silently warn — don't block UX if Supabase insert fails
      console.warn('[SmartProcure] Supabase login_events insert error:', error.message);
    } else {
      console.info(`[SmartProcure] Login event logged → ${payload.event_type} ${payload.status} [${payload.role}]`);
    }
  } catch (err) {
    console.warn('[SmartProcure] Supabase logging failed (non-critical):', err);
  }
};

/**
 * Fetches recent login events from Supabase (for admin/debug purposes).
 */
export const getRecentLoginEvents = async (limit = 50) => {
  const { data, error } = await supabase
    .from('login_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[SmartProcure] Failed to fetch login events:', error.message);
    return [];
  }
  return data || [];
};
