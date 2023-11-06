import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Item>Navigation item</Navigation.Item>)
  expect(screen.getByText("Navigation item")).toBeInTheDocument();
})

it("applies the correct classname when hasActiveChild is provided", () => {
  render(<Navigation.Item hasActiveChild>Navigation item</Navigation.Item>)
  expect(screen.getByText("Navigation item")).toHaveClass("has-active-child");
})
