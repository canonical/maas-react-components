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

it("renders correctly", () => {
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

it("renders custom className and title element", () => {
  const title = "Toolbar title";
  const customClassName = "custom-class";

  render(
    <MainToolbar>
      <MainToolbar.Title as="h5" className={customClassName}>
        {title}
      </MainToolbar.Title>
    </MainToolbar>,
  );

  const heading = screen.getByRole("heading", { name: title, level: 5 });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveClass(customClassName);
});
