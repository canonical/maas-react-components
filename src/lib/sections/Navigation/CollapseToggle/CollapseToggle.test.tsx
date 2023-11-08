import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.CollapseToggle isCollapsed={false} setIsCollapsed={vi.fn()} />)
  expect(screen.getByRole("button", { name: "collapse main navigation" })).toBeInTheDocument();
})

it("changes the aria label when collapsed", () => {
  render(<Navigation.CollapseToggle isCollapsed={true} setIsCollapsed={vi.fn()} />)
  expect(screen.getByRole("button", { name: "expand main navigation" })).toBeInTheDocument();
})

it("displays a tooltip on hover", async () => {
  render(<Navigation.CollapseToggle isCollapsed={false} setIsCollapsed={vi.fn()} />)
  await userEvent.hover(screen.getByRole("button", { name: "collapse main navigation" }))
  expect(screen.getByRole("tooltip", { name: /collapse/i })).toBeInTheDocument();
})

it("calls the provided function on click", async () => {
  const setIsCollapsed = vi.fn();
  render(<Navigation.CollapseToggle isCollapsed={false} setIsCollapsed={setIsCollapsed} />)
  await userEvent.click(screen.getByRole("button", { name: "collapse main navigation" }));
  expect(setIsCollapsed).toHaveBeenCalled();
})