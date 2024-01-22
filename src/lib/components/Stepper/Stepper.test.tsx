import { render, screen } from "@testing-library/react";

import { Stepper } from "./Stepper";

const steps = ["Step 1", "Step 2", "Step 3"];

it("displays initial list of steps", () => {
  render(<Stepper activeStep={0} items={steps} />);
  expect(screen.getByRole("list")).toBeInTheDocument();
  steps.forEach((step) => {
    expect(screen.getByText(step)).toBeInTheDocument();
  });
  steps.forEach((step) => {
    expect(
      screen.queryByLabelText(`${step} (completed)`),
    ).not.toBeInTheDocument();
  });
});

it("marks previous steps as completed when the current step index is higher", () => {
  const { rerender } = render(<Stepper activeStep={2} items={steps} />);

  rerender(<Stepper activeStep={2} items={steps} />);
  ["Step 1", "Step 2"].forEach((step) => {
    expect(screen.getByLabelText(`${step} (completed)`)).toBeInTheDocument();
  });
});

it("does not mark the current step as completed", () => {
  const { rerender } = render(<Stepper activeStep={2} items={steps} />);

  rerender(<Stepper activeStep={2} items={steps} />);
  expect(screen.queryByLabelText("Step 3 (completed)")).not.toBeInTheDocument();
});
