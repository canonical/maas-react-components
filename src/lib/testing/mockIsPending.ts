import { vi } from "vitest";

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
