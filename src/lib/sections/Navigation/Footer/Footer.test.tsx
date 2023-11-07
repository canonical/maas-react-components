import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Footer>Navigation footer</Navigation.Footer>)
  expect(screen.getByText("Navigation footer")).toBeInTheDocument();
})
