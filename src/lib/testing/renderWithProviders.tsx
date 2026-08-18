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
import { createMemoryRouter, RouterProvider } from "react-router";

import { SidePanelContextProvider } from "@/lib";

/** The router instance returned by `createMemoryRouter` / `createBrowserRouter`. */
type DataRouter = ReturnType<typeof createMemoryRouter>;

/**
 * Renders a component with all test-relevant providers (query client, side
 * panel, and router).
 *
 * Any project-specific providers (e.g. a Redux `Provider`, a WebSocket
 * context, etc.) should be supplied via the `AdditionalProviders` option -
 * this library has no dependency on Redux or any other state management
 * library.
 *
 * @param ui       - The component to render.
 * @param options  - Rendering options including router entries and an
 *                   `AdditionalProviders` wrapper for project-specific
 *                   providers (e.g. a Redux `Provider`, WebSocketProvider).
 */
export const renderWithProviders = (
  ui: ReactNode,
  options?: Omit<RenderOptions, "wrapper"> &
    Partial<{
      initialEntries: InitialEntry[];
      pattern: string;
      AdditionalProviders: ComponentType<{ children: ReactNode }>;
    }>,
): {
  result: RenderResult;
  router: DataRouter;
  rerender: (ui: ReactNode) => void;
} => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const router = createMemoryRouter(
    [{ path: options?.pattern ?? "*", element: ui }],
    { initialEntries: options?.initialEntries || ["/"] },
  );

  const AdditionalProviders = options?.AdditionalProviders;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SidePanelContextProvider>
        {AdditionalProviders ? (
          <AdditionalProviders>{children}</AdditionalProviders>
        ) : (
          children
        )}
      </SidePanelContextProvider>
    </QueryClientProvider>
  );

  const rendered = render(<RouterProvider router={router} />, {
    wrapper: Wrapper,
    ...options,
  });

  const customRerender = (ui: ReactNode) => {
    const newRouter = createMemoryRouter(
      [{ path: options?.pattern ?? "*", element: ui }],
      { initialEntries: options?.initialEntries || ["/"] },
    );

    return rendered.rerender(<RouterProvider router={newRouter} />);
  };

  return { result: rendered, rerender: customRerender, router };
};
