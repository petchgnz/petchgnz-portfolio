import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5mins cache before stale
      staleTime: 1000 * 60 * 5,

      // retry only 1 times if it fail
      retry: 1,

      refetchOnWindowFocus: true,
    },
  },
});
