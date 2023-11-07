import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Controls>Navigation controls</Navigation.Controls>)
  expect(screen.getByText("Navigation controls")).toBeInTheDocument();
})
