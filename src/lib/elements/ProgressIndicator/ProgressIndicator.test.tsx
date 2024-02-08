import { render, screen } from "@testing-library/react";

import { ProgressIndicator } from "./ProgressIndicator";

it("renders without crashing", () => {
  render(<ProgressIndicator percentComplete={69} />);
  expect(screen.getByText("69%")).toBeInTheDocument();
});
