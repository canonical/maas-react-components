import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Header>Navigation header</Navigation.Header>)
  expect(screen.getByText("Navigation header")).toBeInTheDocument();
})
