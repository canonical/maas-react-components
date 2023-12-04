import { render, screen } from "@testing-library/react";

import { NavigationBar } from "./Navigation";

it("renders without crashing", () => {
  render(<NavigationBar>Navigation bar</NavigationBar>);
  expect(screen.getByText("Navigation bar")).toBeInTheDocument();
});
