import { render, screen } from "@testing-library/react";

import { Pagination } from "./Pagination";

it("renders without crashing", () => {
  render(<Pagination />);
  expect(screen.getByText("Pagination component")).toBeInTheDocument();
});
