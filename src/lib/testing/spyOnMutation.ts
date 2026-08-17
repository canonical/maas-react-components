import { vi } from "vitest";

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
