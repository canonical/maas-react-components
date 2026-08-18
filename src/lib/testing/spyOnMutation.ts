import { vi } from "vitest";
import type { Mock } from "vitest";

/**
 * Spies on a given mutation hook to observe the mutate function.
 *
 * @param obj        - The module object that contains the hook.
 * @param methodName - The name of the mutation hook to spy on.
 * @returns A mock `mutate` function that can be observed with `expect`.
 */
export const spyOnMutation = (
  obj: unknown,
  methodName: string,
): Mock<(...args: unknown[]) => unknown> => {
  const mockMutate: Mock<(...args: unknown[]) => unknown> = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.spyOn(obj as any, methodName as any).mockImplementation(() => ({
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
