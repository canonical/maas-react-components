import { render, screen } from "@testing-library/react";

import { Navigation } from "./Navigation";

it("renders without crashing", () => {
  render(<Navigation isCollapsed={false}>Navigation component</Navigation>);
  expect(screen.getByText("Navigation component")).toBeInTheDocument();
});

it("applies the correct classname when collapsed", () => {
  render(<Navigation isCollapsed={true}>Navigation component</Navigation>);
  expect(screen.getByText("Navigation component")).toHaveClass("is-collapsed");
});
