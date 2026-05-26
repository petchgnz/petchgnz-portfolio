'use client'

import Navbar from '@/components/layout/navbar';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

const HomePage = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='mx-auto max-w-5xl px-6 py-16'>
        <p className='text-muted-foreground'>Loading section...</p>
      </main>
    </div>
  );
};
export default HomePage;
