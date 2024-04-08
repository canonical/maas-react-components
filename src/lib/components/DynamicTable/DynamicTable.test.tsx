import { render, screen } from "@testing-library/react";

import { DynamicTable } from "./DynamicTable";

it("renders without crashing", () => {
  render(<DynamicTable />);
  expect(screen.getByText("DynamicTable component")).toBeInTheDocument();
});
