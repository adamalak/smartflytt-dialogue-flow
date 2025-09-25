/**
 * Admin Guard Component
 * Protects admin routes by checking authentication and admin role
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { COPY } from '@/data/copy.sv';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show access denied if authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              {COPY.MESSAGES.UNAUTHORIZED}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Du har inte behörighet att komma åt denna sida. Kontakta en administratör om du behöver åtkomst.
            </p>
            <a 
              href="/" 
              className="text-primary hover:underline"
            >
              ← Tillbaka till startsidan
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if user is authenticated admin
  return <>{children}</>;
};