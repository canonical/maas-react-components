import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Drawer>Navigation drawer</Navigation.Drawer>)
  expect(screen.getByText("Navigation drawer")).toBeInTheDocument();
})
