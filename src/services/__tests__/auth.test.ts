/**
 * Unit tests for authentication service
 * Tests admin login, role validation, and security features
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth';
import { mockUsers, mockSupabaseAuthResponse, mockSupabaseResponse } from '@/test/utils';

// Mock Supabase
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should successfully sign in admin user', async () => {
      const credentials = {
        email: 'admin@smartflytt.se',
        password: 'correctpassword',
      };

      // Mock successful auth response
      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.admin)
      );

      // Mock successful role query (fallback will be used since table doesn't exist yet)
      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.admin)
      );

      const result = await authService.signIn(credentials);

      expect(result.error).toBeNull();
      expect(result.user).toBeTruthy();
      expect(result.user?.role).toBe('admin');
      expect(mockSignInWithPassword).toHaveBeenCalledWith(credentials);
    });

    it('should fail with invalid credentials', async () => {
      const credentials = {
        email: 'admin@smartflytt.se',
        password: 'wrongpassword',
      };

      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(null, { message: 'Invalid login credentials' })
      );

      const result = await authService.signIn(credentials);

      expect(result.error).toBe('Ogiltiga inloggningsuppgifter');
      expect(result.user).toBeNull();
    });

    it('should reject non-admin users', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password',
      };

      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.regular)
      );

      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.regular)
      );

      const result = await authService.signIn(credentials);

      expect(result.error).toBe('Du har inte behörighet att komma åt denna sida');
      expect(result.user).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      const credentials = {
        email: 'admin@smartflytt.se',
        password: 'password',
      };

      mockSignInWithPassword.mockRejectedValue(new Error('Network error'));

      const result = await authService.signIn(credentials);

      expect(result.error).toBe('Ett tekniskt fel uppstod. Försök igen senare.');
      expect(result.user).toBeNull();
    });

    it('should use fallback admin role for configured admin emails', async () => {
      const credentials = {
        email: 'smartflyttlogistik@gmail.com', // Fallback admin email
        password: 'password',
      };

      const adminUser = {
        ...mockUsers.admin,
        email: 'smartflyttlogistik@gmail.com',
      };

      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(adminUser)
      );

      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(adminUser)
      );

      const result = await authService.signIn(credentials);

      expect(result.error).toBeNull();
      expect(result.user).toBeTruthy();
      expect(result.user?.role).toBe('admin');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const result = await authService.signOut();

      expect(result.error).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      mockSignOut.mockResolvedValue({ error: { message: 'Sign out failed' } });

      const result = await authService.signOut();

      expect(result.error).toBe('Utloggning misslyckades');
    });

    it('should handle sign out exceptions', async () => {
      mockSignOut.mockRejectedValue(new Error('Network error'));

      const result = await authService.signOut();

      expect(result.error).toBe('Ett tekniskt fel uppstod under utloggning');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current authenticated user', async () => {
      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.admin)
      );

      const result = await authService.getCurrentUser();

      expect(result).toBeTruthy();
      expect(result?.id).toBe(mockUsers.admin.id);
      expect(result?.role).toBe('admin');
    });

    it('should return null when no user is authenticated', async () => {
      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(null)
      );

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockGetUser.mockRejectedValue(new Error('Auth error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('hasAdminRole', () => {
    it('should return true for admin users', () => {
      const result = authService.hasAdminRole(mockUsers.admin);
      expect(result).toBe(true);
    });

    it('should return false for regular users', () => {
      const result = authService.hasAdminRole(mockUsers.regular);
      expect(result).toBe(false);
    });

    it('should return false for null user', () => {
      const result = authService.hasAdminRole(null);
      expect(result).toBe(false);
    });
  });

  describe('onAuthStateChange', () => {
    it('should set up auth state change listener', () => {
      const callback = vi.fn();
      const mockUnsubscribe = vi.fn();

      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } }
      });

      const unsubscribe = authService.onAuthStateChange(callback);

      expect(mockOnAuthStateChange).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe('function');

      // Test unsubscribe
      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should call callback with user when session exists', async () => {
      const callback = vi.fn();
      let authStateCallback: any;

      mockOnAuthStateChange.mockImplementation((cb) => {
        authStateCallback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      mockGetUser.mockResolvedValue(
        mockSupabaseAuthResponse(mockUsers.admin)
      );

      authService.onAuthStateChange(callback);

      // Simulate auth state change
      await authStateCallback('SIGNED_IN', { user: mockUsers.admin });

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUsers.admin.id,
        role: 'admin',
      }));
    });

    it('should call callback with null when no session', async () => {
      const callback = vi.fn();
      let authStateCallback: any;

      mockOnAuthStateChange.mockImplementation((cb) => {
        authStateCallback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      authService.onAuthStateChange(callback);

      // Simulate sign out
      await authStateCallback('SIGNED_OUT', null);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('createAdminAccount', () => {
    it('should create admin account successfully', async () => {
      const email = 'newadmin@smartflytt.se';
      const password = 'securepassword';

      // Mock auth signup
      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse({ ...mockUsers.admin, email })
      );

      // Mock role assignment (will use fallback since table doesn't exist)
      const mockInsert = vi.fn().mockReturnValue({
        mockResolvedValue: mockSupabaseResponse(null)
      });
      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      const result = await authService.createAdminAccount(email, password);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle signup failures', async () => {
      const email = 'newadmin@smartflytt.se';
      const password = 'weakpwd';

      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(null, { message: 'Password is too weak' })
      );

      const result = await authService.createAdminAccount(email, password);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is too weak');
    });
  });

  describe('Error Message Formatting', () => {
    it('should format common auth errors to Swedish', async () => {
      const testCases = [
        { error: 'Invalid login credentials', expected: 'Ogiltiga inloggningsuppgifter' },
        { error: 'Email not confirmed', expected: 'E-postadressen är inte bekräftad' },
        { error: 'Too many requests', expected: 'För många inloggningsförsök. Försök igen senare.' },
        { error: 'User not found', expected: 'Användaren hittades inte' },
      ];

      for (const testCase of testCases) {
        mockSignInWithPassword.mockResolvedValue(
          mockSupabaseAuthResponse(null, { message: testCase.error })
        );

        const result = await authService.signIn({
          email: 'test@example.com',
          password: 'password',
        });

        expect(result.error).toBe(testCase.expected);
      }
    });

    it('should provide fallback message for unknown errors', async () => {
      mockSignInWithPassword.mockResolvedValue(
        mockSupabaseAuthResponse(null, { message: 'Unknown auth error' })
      );

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.error).toBe('Ett fel uppstod vid inloggning');
    });
  });
});