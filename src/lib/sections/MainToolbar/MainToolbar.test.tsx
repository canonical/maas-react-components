import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { MainToolbar } from ".";

const originalObserver = window.ResizeObserver;
beforeEach(() => {
  window.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});
afterEach(() => {
  window.ResizeObserver = originalObserver;
});

test("renders correctly", () => {
  const title = "Toolbar title";
  const buttonLabel = "Toolbar button";

  render(
    <MainToolbar>
      <MainToolbar.Title>{title}</MainToolbar.Title>
      <MainToolbar.Controls>
        <button>{buttonLabel}</button>
      </MainToolbar.Controls>
    </MainToolbar>,
  );

  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: buttonLabel })).toBeInTheDocument();
});
