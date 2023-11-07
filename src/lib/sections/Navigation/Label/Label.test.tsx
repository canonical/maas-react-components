import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Label>Navigation label</Navigation.Label>)
  expect(screen.getByText("Navigation label")).toBeInTheDocument();
})

it("applies the correct classname for the 'group' variant", () => {
  render(<Navigation.Label variant="group">Navigation label</Navigation.Label>)
  expect(screen.getByText("Navigation label")).toHaveClass("p-side-navigation__label--group");
})
