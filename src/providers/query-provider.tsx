"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useExchangeRateQuery } from "@/hooks/use-exchange-rate";
import { getQueryClient } from "@/lib/query-client";

function ExchangeRateSync() {
  useExchangeRateQuery();
  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ExchangeRateSync />
      {children}
    </QueryClientProvider>
  );
}
