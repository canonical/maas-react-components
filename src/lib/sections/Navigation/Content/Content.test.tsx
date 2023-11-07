import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Content>Navigation content</Navigation.Content>)
  expect(screen.getByText("Navigation content")).toBeInTheDocument();
})
