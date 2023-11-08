import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Text>Navigation text</Navigation.Text>)
  expect(screen.getByText("Navigation text")).toBeInTheDocument();
})
