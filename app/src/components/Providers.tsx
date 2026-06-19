"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { MetaPixel } from "@/components/store/MetaPixel";

// For development testing, you can temporarily use MetaPixelDebug instead:
// import { MetaPixelDebug } from "@/components/store/MetaPixelDebug";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <MetaPixel />
      {/* For development testing, replace with: <MetaPixelDebug /> */}
    </QueryClientProvider>
  );
}
