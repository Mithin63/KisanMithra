import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { localState } from '../services/api';
import { logLoginEvent } from '../services/authLogger';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (mobile: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to null so user must log in first
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('FARMER');
  const [demoMode, setDemoMode] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = localState.subscribe(() => {
      // Re-sync user state if profile changes
      if (user) {
        const updated = localState.users.find(u => u.id === user.id);
        if (updated) setUser({ ...updated });
      }
    });
    return unsubscribe;
  }, [user]);

  const login = (mobile: string, overrideRole?: UserRole): boolean => {
    let found = localState.users.find(u => u.mobile === mobile);
    
    // Quick fallback role presets
    if (!found) {
      if (mobile === '9876543210') found = localState.users[0]; // Farmer
      else if (mobile === '9876543211') found = localState.users[1]; // Officer
      else if (mobile === '9876543212') found = localState.users[2]; // Admin
    }

    if (found) {
      const activeRole = overrideRole || found.role;
      setUser(found);
      setRole(activeRole);

      // Persist login event to Supabase
      logLoginEvent({
        mobile: found.mobile,
        email: found.email,
        role: activeRole,
        event_type: 'LOGIN',
        status: 'SUCCESS',
      });

      return true;
    }

    // Persist failed login attempt to Supabase
    logLoginEvent({
      mobile,
      role: overrideRole || 'FARMER',
      event_type: 'LOGIN',
      status: 'FAILED',
      error_message: 'User not found in system',
    });

    return false;
  };

  const logout = () => {
    if (user) {
      // Persist logout event to Supabase
      logLoginEvent({
        mobile: user.mobile,
        email: user.email,
        role,
        event_type: 'LOGOUT',
        status: 'SUCCESS',
      });
    }
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'FARMER') setUser(localState.users[0]);
    else if (newRole === 'OFFICER') setUser(localState.users[1]);
    else if (newRole === 'ADMIN') setUser(localState.users[2]);
  };

  const toggleDemoMode = () => {
    setDemoMode(prev => !prev);
    localState.demoModeActive = !demoMode;
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole, demoMode, toggleDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
