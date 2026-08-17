import type { ComponentType, ReactNode } from "react";

/**
 * `InitialEntry` is not re-exported by react-router v6 so we pull it from its
 * transitive dependency. When upgrading to react-router v7 both types will be
 * available directly from "react-router".
 */
import type { InitialEntry } from "@remix-run/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { Store } from "redux";

import { SidePanelContextProvider } from "@/lib";
import { createTestStore } from "@/lib/testing/utils";

/** The router instance returned by `createMemoryRouter` / `createBrowserRouter`. */
type DataRouter = ReturnType<typeof createMemoryRouter>;

/**
 * Renders a component with all test-relevant providers (query client, side
 * panel, Redux, and router).
 *
 * @typeParam S - The Redux state shape for this project.
 *
 * @param ui       - The component to render.
 * @param options  - Rendering options including optional Redux state, a custom
 *                   store, router entries, and an `AdditionalProviders` wrapper
 *                   for project-specific providers (e.g. WebSocketProvider).
 */
export const renderWithProviders = <S extends object = Record<string, unknown>>(
  ui: ReactNode,
  options?: Omit<RenderOptions, "wrapper"> &
    Partial<{
      state: Partial<S>;
      store: Store;
      initialEntries: InitialEntry[];
      pattern: string;
      AdditionalProviders: ComponentType<{ children: ReactNode }>;
    }>,
): {
  result: RenderResult;
  router: DataRouter;
  rerender: (ui: ReactNode, opts?: { state?: S }) => void;
  store: Store;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const router = createMemoryRouter(
    [{ path: options?.pattern ?? "*", element: ui }],
    { initialEntries: options?.initialEntries || ["/"] },
  );

  let store: Store = options?.store ?? createTestStore<S>(options?.state);

  const AdditionalProviders = options?.AdditionalProviders;

  const Wrapper = ({ children }: { children: ReactNode }) => (
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
  );

  const rendered = render(<RouterProvider router={router} />, {
    wrapper: Wrapper,
    ...options,
  });

  const customRerender = (
    ui: ReactNode,
    { state: newState }: { state?: S } = {},
  ) => {
    if (newState) {
      store = createTestStore<S>({ ...options?.state, ...newState });
    }
    const newRouter = createMemoryRouter(
      [{ path: options?.pattern ?? "*", element: ui }],
      { initialEntries: options?.initialEntries || ["/"] },
    );

    return rendered.rerender(<RouterProvider router={newRouter} />);
  };

  return { result: rendered, rerender: customRerender, router, store };
};
