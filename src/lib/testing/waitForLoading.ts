import { screen } from "@testing-library/react";
import { vi } from "vitest";

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
