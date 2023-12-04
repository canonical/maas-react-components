import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.LogoText>Navigation logo text</Navigation.LogoText>)
  expect(screen.getByText("Navigation logo text")).toBeInTheDocument();
})
