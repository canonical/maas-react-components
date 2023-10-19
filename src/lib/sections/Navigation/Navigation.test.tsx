import { render, screen } from "@testing-library/react";

import { Navigation } from "./Navigation";

it("renders without crashing", () => {
  render(<Navigation />);
  expect(screen.getByText("Navigation component")).toBeInTheDocument();
});
