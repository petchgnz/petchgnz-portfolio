'use client'

import { queryClient } from "@/lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>

      {/* this DevTools will open only in dev mode */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
