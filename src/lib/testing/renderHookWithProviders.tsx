import type { ComponentType, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { SidePanelContextProvider } from "@/lib";

/**
 * Renders a hook with all test-relevant providers (query client and side
 * panel).
 *
 * Any project-specific providers (e.g. a Redux `Provider`, a WebSocket
 * context, etc.) should be supplied via the `AdditionalProviders` option -
 * this library has no dependency on Redux or any other state management
 * library.
 *
 * @typeParam T - The return type of the hook.
 */
export const renderHookWithProviders = <T,>(
  hook: () => T,
  options?: Partial<{
    initialEntries: string[];
    AdditionalProviders: ComponentType<{ children: ReactNode }>;
  }>,
): {
  result: { current: T };
  queryClient: QueryClient;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const AdditionalProviders = options?.AdditionalProviders;

  return {
    result: renderHook(hook, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <SidePanelContextProvider>
            {AdditionalProviders ? (
              <AdditionalProviders>{children}</AdditionalProviders>
            ) : (
              children
            )}
          </SidePanelContextProvider>
        </QueryClientProvider>
      ),
    }).result,
    queryClient,
  };
};
