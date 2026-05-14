'use client'

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={'default'}
      size={'icon'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className='size-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0' />
      <Moon className='absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />

      {/* sr-only: for accessibility  */}
      <span className='sr-only'>Toggle themes</span>
    </Button>
  );
};

export default ThemeToggle;
