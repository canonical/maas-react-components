import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.List>Navigation list</Navigation.List>)
  expect(screen.getByText("Navigation list")).toBeInTheDocument();
})
