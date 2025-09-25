/**
 * Login Page Component
 * Provides authentication interface for admin users
 */

import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { signIn } from '@/services/auth';
import { COPY } from '@/data/copy.sv';
import { logger } from '@/services/logger';

const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress').min(1, 'E-postadress krävs'),
  password: z.string().min(1, 'Lösenord krävs'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      logger.info('Admin login successful', { email: data.email, component: 'LoginPage' });
      navigate('/admin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Inloggning misslyckades';
      setError(errorMessage);
      logger.error('Admin login failed', { error, email: data.email, component: 'LoginPage' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {COPY.ADMIN.LOGIN_TITLE}
          </CardTitle>
          <p className="text-muted-foreground">
            Logga in för att komma åt admin-panelen
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{COPY.ADMIN.LOGIN_EMAIL}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@smartflytt.se"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{COPY.ADMIN.LOGIN_PASSWORD}</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loggar in...' : COPY.ADMIN.LOGIN_BUTTON}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Tillbaka till startsidan
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;