import type { ComponentType, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import type { Store } from "redux";

import { SidePanelContextProvider } from "@/lib";
import { createTestStore } from "@/lib/testing/utils";

/**
 * Renders a hook with all test-relevant providers (query client, side panel,
 * and Redux).
 *
 * @typeParam T - The return type of the hook.
 * @typeParam S - The Redux state shape for this project.
 */
export const renderHookWithProviders = <
  T,
  S extends object = Record<string, unknown>,
>(
  hook: () => T,
  options?: Partial<{
    state: Partial<S>;
    store: Store;
    initialEntries: string[];
    AdditionalProviders: ComponentType<{ children: ReactNode }>;
  }>,
): {
  result: { current: T };
  store: Store;
  queryClient: QueryClient;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const store: Store = options?.store ?? createTestStore<S>(options?.state);

  const AdditionalProviders = options?.AdditionalProviders;

  return {
    result: renderHook(hook, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <SidePanelContextProvider>
            <Provider store={store}>
              {AdditionalProviders ? (
                <AdditionalProviders>{children}</AdditionalProviders>
              ) : (
                children
              )}
            </Provider>
          </SidePanelContextProvider>
        </QueryClientProvider>
      ),
    }).result,
    store,
    queryClient,
  };
};
