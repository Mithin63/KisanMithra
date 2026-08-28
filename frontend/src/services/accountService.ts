import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

/**
 * Service to manage the Supabase `registered_accounts` table.
 * Only users who have registered (created an account) can log in.
 */

export interface RegisteredAccount {
  id?: string;
  name: string;
  mobile: string;
  role: UserRole;
  farmer_id?: string;
  district?: string;
  village?: string;
  address?: string;
  aadhaar_last4?: string;
  email?: string;
  created_at?: string;
}

/**
 * Register a new account in Supabase.
 * Returns the inserted row or null on error.
 */
export const registerAccount = async (account: RegisteredAccount): Promise<RegisteredAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('registered_accounts')
      .insert([{
        name: account.name,
        mobile: account.mobile,
        role: account.role,
        farmer_id: account.farmer_id || null,
        district: account.district || null,
        village: account.village || null,
        address: account.address || null,
        aadhaar_last4: account.aadhaar_last4 || null,
        email: account.email || null,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.warn('[SmartProcure] Supabase register error:', error.message);
      return null;
    }
    console.info(`[SmartProcure] Account registered → ${account.name} (${account.mobile})`);
    return data as RegisteredAccount;
  } catch (err) {
    console.warn('[SmartProcure] Registration failed:', err);
    return null;
  }
};

/**
 * Check if a mobile number is registered in Supabase.
 * Returns the account row if found, null otherwise.
 */
export const checkAccountExists = async (mobile: string): Promise<RegisteredAccount | null> => {
  try {
    const { data, error } = await supabase
      .from('registered_accounts')
      .select('*')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) {
      console.warn('[SmartProcure] Supabase account check error:', error.message);
      return null;
    }
    return data as RegisteredAccount | null;
  } catch (err) {
    console.warn('[SmartProcure] Account check failed:', err);
    return null;
  }
};

/**
 * Seed default demo accounts into Supabase if they don't already exist.
 * Called once on app startup to ensure demo users can log in.
 */
export const seedDefaultAccounts = async (): Promise<void> => {
  const defaults: RegisteredAccount[] = [
    { name: 'Rajesh Kumar', mobile: '9876543210', role: 'FARMER', farmer_id: 'AP-FARM-9872', district: 'Guntur', village: 'Pedakakani' },
    { name: 'Officer Sharma', mobile: '9876543211', role: 'OFFICER' },
    { name: 'Admin User', mobile: '9876543212', role: 'ADMIN', email: 'admin@smartprocure.gov.in' },
  ];

  for (const acc of defaults) {
    const exists = await checkAccountExists(acc.mobile);
    if (!exists) {
      await registerAccount(acc);
    }
  }
};

/**
 * Fetch all registered accounts (admin/debug use).
 */
export const getAllAccounts = async (limit = 100): Promise<RegisteredAccount[]> => {
  const { data, error } = await supabase
    .from('registered_accounts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[SmartProcure] Failed to fetch accounts:', error.message);
    return [];
  }
  return (data || []) as RegisteredAccount[];
};
