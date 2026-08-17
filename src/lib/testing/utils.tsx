import type { ComponentType, ReactNode } from "react";

import { configureStore } from "@reduxjs/toolkit";
/**
 * `InitialEntry` is not re-exported by react-router v6 so we pull it from its
 * transitive dependency. When upgrading to react-router v7 both types will be
 * available directly from "react-router".
 */
import type { InitialEntry } from "@remix-run/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { Store } from "redux";
import { vi } from "vitest";

import { SidePanelContextProvider } from "@/lib";

/** The router instance returned by `createMemoryRouter` / `createBrowserRouter`. */
type DataRouter = ReturnType<typeof createMemoryRouter>;

/**
 * Creates a minimal RTK store preloaded with `state`. The reducer is an
 * identity function, so it's only useful for tests that need a specific
 * state shape but don't exercise Redux logic (use a real store otherwise).
 */
const createTestStore = <S extends object>(preloadedState?: Partial<S>) =>
  configureStore({
    reducer: (state = (preloadedState ?? {}) as S) => state,
    preloadedState: preloadedState as S | undefined,
  });

/**
 * Sets up an MSW mock server for use in tests.
 *
 * @param client  - The Hey-API client instance (from `@/app/apiclient/client.gen` in maas-ui).
 * @param baseUrl - The base URL to configure on the client.
 * @param handlers - MSW request handlers.
 */
export const setupMockServer = (
  client: { setConfig: (config: { baseUrl: string }) => void },
  baseUrl: string,
  ...handlers: RequestHandler[]
) => {
  client.setConfig({ baseUrl });

  const mockServer = setupServer(...handlers);

  beforeAll(() => {
    mockServer.listen({ onUnhandledRequest: "error" });
  });
  afterEach(() => {
    mockServer.resetHandlers();
  });
  afterAll(() => {
    mockServer.close();
  });

  return mockServer;
};

/**
 * Asserts that hovering an element reveals a tooltip with the given text.
 */
export const expectTooltipOnHover = async (
  element: Element | null,
  tooltipText: string | RegExp,
): Promise<void> => {
  expect(
    screen.queryByRole("tooltip", { name: tooltipText }),
  ).not.toBeInTheDocument();

  if (!element) {
    throw new Error("expectTooltipOnHover: the element was null or undefined");
  }

  await userEvent.hover(element);

  if (element.querySelector("i")) {
    await userEvent.hover(element.querySelector("i")!);
  }

  await vi.waitFor(() =>
    expect(screen.getAllByRole("tooltip", { name: tooltipText })).toHaveLength(
      1,
    ),
  );
};

/**
 * Waits until the loading text is no longer present in the document.
 *
 * @param loadingText - Text to query for. Defaults to "Loading".
 * @param options     - Optional `vi.waitFor` options (`interval`, `timeout`).
 */
export const waitForLoading = async (
  loadingText = "Loading",
  options?: { interval?: number; timeout?: number },
) =>
  await vi.waitFor(
    () =>
      expect(
        screen.queryByText(new RegExp(loadingText, "i")),
      ).not.toBeInTheDocument(),
    options,
  );

/**
 * Spies on `useQuery` from `@tanstack/react-query` to return a pending state
 * for the first call in each test. Uses `vi.spyOn` (via `vi.doMock`) rather
 * than mocking the return value directly, since the module is already loaded.
 */
export const mockIsPending = () => {
  vi.doMock("@tanstack/react-query", async () => {
    const actual: object = await vi.importActual("@tanstack/react-query");
    return {
      ...actual,
      useQuery: vi.fn().mockReturnValueOnce({
        data: null,
        isPending: true,
        failureReason: undefined,
        isFetched: false,
      }),
    };
  });

  afterEach(() => {
    vi.doUnmock("@tanstack/react-query");
  });
};


/**
 * Spies on a given mutation hook to observe the mutate function.
 *
 * @param obj        - The module object that contains the hook.
 * @param methodName - The name of the mutation hook to spy on.
 * @returns A mock `mutate` function that can be observed with `expect`.
 */
export const spyOnMutation = (obj: unknown, methodName: string) => {
  const mockMutate = vi.fn();
  vi.spyOn(obj, methodName as never).mockImplementation(() => ({
    mutate: mockMutate,
    mutateAsync: vi.fn(),
    data: undefined,
    variables: undefined,
    error: null,
    isError: false,
    isPending: false,
    isIdle: true,
    isSuccess: false,
    status: "idle" as const,
    reset: vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  return mockMutate;
};

/**
 * Mocks the `useSidePanel` hook, returning `mockOpen`/`mockClose` spies.
 */
export const mockSidePanel = async () => {
  const mockUseSidePanel = vi.spyOn(
    await import("../index"), // the library's own barrel export
    "useSidePanel",
  );

  const mockOpen = vi.fn();
  const mockClose = vi.fn();
  let isOpen = false;

  const makeReturnValue = () => ({
    isOpen,
    title: "",
    size: "regular" as const,
    component: null,
    props: {},
    openSidePanel: mockOpen,
    closeSidePanel: mockClose,
    setSidePanelSize: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    isOpen = false;

    mockOpen.mockImplementation(() => {
      isOpen = true;
      mockUseSidePanel.mockReturnValue(makeReturnValue());
    });

    mockClose.mockImplementation(() => {
      isOpen = false;
      mockUseSidePanel.mockReturnValue(makeReturnValue());
    });

    mockUseSidePanel.mockReturnValue(makeReturnValue());
  });

  return { mockOpen, mockClose };
};

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
