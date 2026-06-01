'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { ArrowLeft, Loader2, Sparkles, Lock, Mail, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';

// -- Zod Schema ----------
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFromValue = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, checkAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

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
    <div className='relative flex min-h-screen items-center justify-center px-4 overflow-hidden'>
      {/* Background gradient */}
      {/* <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]' />
        <div className='absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/15 blur-[120px]' />
      </div> */}

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
        <Link
          href='/'
          className='mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to portfolio
        </Link>

        <Card>
          <CardHeader className='space-y-1 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10'>
              <Sparkles className='h-8 w-8 text-primary' />
            </div>
            <CardTitle className='text-2xl'>Welcome back, Petchgnz! ... Aren&apos;t you?</CardTitle>
            <CardDescription>Sign in to enable edit mode</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* Email */}
              <Field
                data-invalid={!!form.formState.errors.email}
                className='relative'
              >
                <FieldLabel htmlFor='email'>Email</FieldLabel>

                <div className='pointer-events-none absolute left-4 top-[50px] -translate-y-1/2'>
                  <Mail className='size-4 text-muted-foreground' />
                </div>

                <Input
                  id='email'
                  type='email'
                  placeholder='your-portfolio@email.com'
                  aria-invalid={!!form.formState.errors.email}
                  className='pl-10'
                  {...form.register('email')}
                />

                {form.formState.errors.email && (
                  <FieldError
                    errors={[form.formState.errors.email]}
                  ></FieldError>
                )}
              </Field>

              <Field
                data-invalid={!!form.formState.errors.password}
                className='relative'
              >
                <FieldLabel htmlFor='password'>Password</FieldLabel>

                <div className='relative'>
                  {/* left icon */}
                  <div className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2'>
                    <Lock className='size-4 text-muted-foreground' />
                  </div>

                  {/* input */}
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    aria-invalid={!!form.formState.errors.password}
                    className='pl-10'
                    {...form.register('password')}
                  />

                  {/* eye button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

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
                className='w-full cursor-pointer'
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
