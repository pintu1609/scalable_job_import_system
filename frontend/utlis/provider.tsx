"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Provider({ children }: { children: ReactNode }) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } })
  );

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
