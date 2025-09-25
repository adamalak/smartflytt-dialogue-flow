/**
 * Authentication Context for Smartflytt
 * Provides authentication state management and admin role checking
 */

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';
import type { AuthUser } from '@/types';
import { getCurrentUser, hasAdminRole } from '@/services/auth';

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async (): Promise<void> => {
    try {
      if (session?.user) {
        const authUser = await getCurrentUser(session.user);
        const adminStatus = await hasAdminRole(authUser);
        
        setUser(authUser);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      logger.error('Failed to refresh user', { error, component: 'AuthContext' });
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out failed', { error, component: 'AuthContext' });
        throw error;
      }
      
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      logger.info('User signed out successfully', { component: 'AuthContext' });
    } catch (error) {
      logger.error('Sign out error', { error, component: 'AuthContext' });
      throw error;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.debug('Auth state changed', { event, userId: session?.user?.id });
        
        setSession(session);
        
        // Defer user/admin check to avoid blocking auth state changes
        if (session?.user) {
          setTimeout(async () => {
            try {
              const authUser = await getCurrentUser(session.user);
              const adminStatus = await hasAdminRole(authUser);
              
              setUser(authUser);
              setIsAdmin(adminStatus);
              setLoading(false);
            } catch (error) {
              logger.error('Failed to get user details', { 
                error, 
                userId: session.user.id,
                component: 'AuthContext' 
              });
              setUser(null);
              setIsAdmin(false);
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const contextValue: AuthContextType = {
    session,
    user,
    isAdmin,
    loading,
    signOut: handleSignOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};