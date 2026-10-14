import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.List>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).toBeInTheDocument();
})

it("does not set aria-expanded by default", () => {
  render(<Navigation.List>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).not.toHaveAttribute("aria-expanded");
})

it("reflects the isExpanded prop via aria-expanded", () => {
  render(<Navigation.List isExpanded={false}>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).toHaveAttribute("aria-expanded", "false");
})
