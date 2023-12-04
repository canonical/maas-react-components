import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Banner>Navigation banner</Navigation.Banner>)
  expect(screen.getByText("Navigation banner")).toBeInTheDocument();
})
