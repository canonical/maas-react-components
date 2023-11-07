import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.LogoName>Navigation logo name</Navigation.LogoName>)
  expect(screen.getByText("Navigation logo name")).toBeInTheDocument();
})

it("applies the correct classname when given the 'small' variant", () => {
  render(<Navigation.LogoName variant="small">Navigation logo name</Navigation.LogoName>)
  expect(screen.getByText("Navigation logo name")).toHaveClass("p-panel__logo-name--small");
})
