'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/layout/theme-toggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// -- Zod Schema ----------
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFromValue = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, checkAuth } = useAuthStore();

  // checkAuth when 1st loaded
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if logged in already, navigate to main page
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/');
  }, [isAuthenticated, isLoading, router]);

  const form = useForm<LoginFromValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFromValue) => {
    try {
      await login(values.email, values.password);
      router.replace('/');
    } catch {
      form.setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center px-4'>

      {/* Toggle Theme on the top right corner */}
      <div className='absolute right-4 top-4'>
        <ThemeToggle />
      </div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className='w-full max-w-sm'
      >
        <Card>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Welcome back</CardTitle>
            <CardDescription>Sign in to manage portfolio</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* Email */}
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor='email'>Email</FieldLabel>

                <Input
                  id='email'
                  type='email'
                  placeholder='admin@example.com'
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register('email')}
                />

                {form.formState.errors.email && (
                  <FieldError
                    errors={[form.formState.errors.email]}
                  ></FieldError>
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor='password'>Password</FieldLabel>

                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />

                {form.formState.errors.password && (
                  <FieldError
                    errors={[form.formState.errors.password]}
                  ></FieldError>
                )}
              </Field>

              {form.formState.errors.root && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-sm font-medium text-destructive'
                >
                  {form.formState.errors.root.message}
                </motion.p>
              )}

              {/* Buttons */}
              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ?
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Signing in...
                  </>
                : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
