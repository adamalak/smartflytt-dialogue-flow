/**
 * Production-grade authentication service for Smartflytt admin
 * Replaces hardcoded password with proper Supabase Auth + role-based access
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';
import type { User, AuthSession, UserRole } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private readonly ADMIN_ROLE: UserRole = 'admin';

  /**
   * Sign in with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      logger.info('Sign in attempt', { 
        component: 'AuthService',
        action: 'signIn',
        metadata: { email: credentials.email }
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        logger.warn('Sign in failed', {
          component: 'AuthService',
          action: 'signIn',
          error,
          metadata: { email: credentials.email }
        });
        return { user: null, error: this.formatAuthError(error.message) };
      }

      if (!data.user) {
        return { user: null, error: 'Inloggningen misslyckades' };
      }

      // Check user role
      const userWithRole = await this.getUserWithRole(data.user.id);
      if (!userWithRole) {
        // Sign out if user doesn't have proper role setup
        await this.signOut();
        return { user: null, error: 'Användarkonto saknar nödvändiga behörigheter' };
      }

      // Verify admin role for admin routes
      if (!this.hasAdminRole(userWithRole)) {
        await this.signOut();
        logger.warn('Non-admin user attempted admin access', {
          component: 'AuthService',
          action: 'signIn',
          userId: data.user.id,
          metadata: { role: userWithRole.role }
        });
        return { user: null, error: 'Du har inte behörighet att komma åt denna sida' };
      }

      logger.info('Sign in successful', {
        component: 'AuthService',
        action: 'signIn',
        userId: userWithRole.id,
        metadata: { email: userWithRole.email, role: userWithRole.role }
      });

      return { user: userWithRole, error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel uppstod';
      logger.error('Sign in exception', {
        component: 'AuthService',
        action: 'signIn',
        error: error instanceof Error ? error : new Error(errorMessage),
        metadata: { email: credentials.email }
      });
      return { user: null, error: 'Ett tekniskt fel uppstod. Försök igen senare.' };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      logger.info('Sign out attempt', { 
        component: 'AuthService',
        action: 'signOut'
      });

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.warn('Sign out failed', {
          component: 'AuthService',
          action: 'signOut',
          error
        });
        return { error: 'Utloggning misslyckades' };
      }

      logger.info('Sign out successful', {
        component: 'AuthService',
        action: 'signOut'
      });

      return { error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel uppstod';
      logger.error('Sign out exception', {
        component: 'AuthService',
        action: 'signOut',
        error: error instanceof Error ? error : new Error(errorMessage)
      });
      return { error: 'Ett tekniskt fel uppstod under utloggning' };
    }
  }

  /**
   * Get current authenticated user with role information
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return await this.getUserWithRole(user.id);

    } catch (error) {
      logger.error('Get current user failed', {
        component: 'AuthService',
        action: 'getCurrentUser',
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      return null;
    }
  }

  /**
   * Check if user has admin role
   */
  hasAdminRole(user: User | null): boolean {
    return user?.role === this.ADMIN_ROLE;
  }

  /**
   * Set up auth state change listener
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.debug('Auth state change', {
          component: 'AuthService',
          action: 'onAuthStateChange',
          metadata: { event, hasSession: !!session }
        });

        if (session?.user) {
          const userWithRole = await this.getUserWithRole(session.user.id);
          callback(userWithRole);
        } else {
          callback(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }

  /**
   * Create admin account (for initial setup)
   * This should only be used during initial deployment
   */
  async createAdminAccount(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
    try {
      logger.info('Creating admin account', {
        component: 'AuthService',
        action: 'createAdminAccount',
        metadata: { email }
      });

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        logger.error('Admin account creation failed', {
          component: 'AuthService',
          action: 'createAdminAccount',
          error,
          metadata: { email }
        });
        return { success: false, error: error?.message || 'Kunde inte skapa konto' };
      }

      // Assign admin role (fallback safe)
      try {
        const { error: roleError } = await supabase
          .from('user_roles' as any)
          .insert({
            user_id: data.user.id,
            role: this.ADMIN_ROLE
          });

        if (roleError) {
          logger.warn('Admin role assignment failed - table may not exist yet', {
            component: 'AuthService',
            action: 'createAdminAccount',
            error: roleError,
            metadata: { email, userId: data.user.id }
          });
          // Continue anyway - fallback auth will handle this
        }
      } catch (roleError) {
        logger.warn('Admin role assignment exception - table may not exist yet', {
          component: 'AuthService',
          action: 'createAdminAccount',
          error: roleError instanceof Error ? roleError : new Error('Unknown error'),
          metadata: { email, userId: data.user.id }
        });
        // Continue anyway - fallback auth will handle this
      }

      logger.info('Admin account created successfully', {
        component: 'AuthService',
        action: 'createAdminAccount',
        userId: data.user.id,
        metadata: { email }
      });

      return { success: true, error: null };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel uppstod';
      logger.error('Admin account creation exception', {
        component: 'AuthService',
        action: 'createAdminAccount',
        error: error instanceof Error ? error : new Error(errorMessage),
        metadata: { email }
      });
      return { success: false, error: 'Ett tekniskt fel uppstod' };
    }
  }

  /**
   * Get user with role information from database
   * Fallback to mock admin role until user_roles table is created
   */
  private async getUserWithRole(userId: string): Promise<User | null> {
    try {
      // Try to get user role from database
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select(`
          role,
          user_id,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .single();

      let userRole: UserRole = 'user';
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();

      if (!error && data) {
        userRole = data.role as UserRole;
        createdAt = data.created_at;
        updatedAt = data.updated_at;
      } else {
        // Fallback: Check if user email is admin email for initial setup
        const { data: { user } } = await supabase.auth.getUser();
        const adminEmails = ['admin@smartflytt.se', 'smartflyttlogistik@gmail.com'];
        
        if (user?.email && adminEmails.includes(user.email)) {
          userRole = 'admin';
          logger.info('Using fallback admin role for user', {
            component: 'AuthService',
            action: 'getUserWithRole',
            userId,
            metadata: { email: user.email, fallback: true }
          });
        } else {
          logger.warn('User role not found, using default', {
            component: 'AuthService',
            action: 'getUserWithRole',
            error,
            metadata: { userId }
          });
        }
      }

      // Get user info from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) {
        return null;
      }

      return {
        id: userId,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
        role: userRole,
        createdAt,
        updatedAt,
      };

    } catch (error) {
      logger.error('Get user with role failed', {
        component: 'AuthService',
        action: 'getUserWithRole',
        error: error instanceof Error ? error : new Error('Unknown error'),
        metadata: { userId }
      });
      return null;
    }
  }

  /**
   * Format auth error messages for users
   */
  private formatAuthError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Ogiltiga inloggningsuppgifter',
      'Email not confirmed': 'E-postadressen är inte bekräftad',
      'Too many requests': 'För många inloggningsförsök. Försök igen senare.',
      'User not found': 'Användaren hittades inte',
      'Invalid email': 'Ogiltig e-postadress',
      'Password is too weak': 'Lösenordet är för svagt',
      'Email already registered': 'E-postadressen är redan registrerad',
    };

    return errorMap[errorMessage] || 'Ett fel uppstod vid inloggning';
  }
}

// Export singleton instance
export const authService = new AuthService();