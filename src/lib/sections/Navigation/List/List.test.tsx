import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.List>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).toBeInTheDocument();
})

it("does not set data-expanded by default", () => {
  render(<Navigation.List>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).not.toHaveAttribute("data-expanded");
})

it("reflects the isExpanded prop via data-expanded", () => {
  render(<Navigation.List isExpanded={false}>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).toHaveAttribute("data-expanded", "false");
})
