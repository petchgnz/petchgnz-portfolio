'use client';

import ThemeToggle from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { cancelFrame } from 'framer-motion';
import { Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experiences' },
  { label: 'Contact', href: '#contact' },
];

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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();

    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-6'>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='cursor-pointer font-semibold tracking-tight transition-opacity hover:opacity-70'
        >
          Phummarin&apos;s Portfolio
        </button>

        {/* menu here */}
        <nav className='hidden items-center gap-1 md:flex'>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className='rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            >
              {label}
            </a>
          ))}
        </nav>

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
