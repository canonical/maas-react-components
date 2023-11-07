import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.LogoTag>Navigation logo tag</Navigation.LogoTag>)
  expect(screen.getByText("Navigation logo tag")).toBeInTheDocument();
})
