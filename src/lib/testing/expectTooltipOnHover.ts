import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

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
