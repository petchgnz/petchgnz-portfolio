'use client';

import ThemeToggle from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-6'>
        <span className='font-semibold tracking-tight'>
          Petchgnz&apos;s Portfolio
        </span>

        <div className='flex items-center gap-4'>
          <ThemeToggle />

          {!isLoading && (
            <>
              {isAuthenticated ?
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={handleLogout}
                  className='cursor-pointer flex justify-center'
                >
                  <LogOut className='size-4' />
                </Button>
              : <Button
                  variant={'outline'}
                  size={'sm'}
                  onClick={() => router.push('/login')}
                  className='cursor-pointer flex justify-center'
                >
                  <Shield className='size-4' />
                  Admin Login
                </Button>
              }
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
