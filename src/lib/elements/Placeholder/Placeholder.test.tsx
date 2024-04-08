import { render, screen } from "@testing-library/react";

import { Placeholder } from "./Placeholder";

it("always hides placeholder text passed as a text prop", async () => {
  const { rerender } = render(<Placeholder text="Placeholder text" />);
  expect(screen.queryByText(/Placeholder text/)).not.toBeInTheDocument();
  rerender(<Placeholder isPending text="Placeholder text" />);
  expect(screen.queryByText(/Placeholder text/)).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

it("hides the children when loading", async () => {
  const { rerender } = render(<Placeholder>Placeholder children</Placeholder>);
  expect(screen.getByText(/Placeholder children/)).toBeInTheDocument();
  rerender(<Placeholder isPending>Placeholder children</Placeholder>);
  expect(screen.queryByText(/Placeholder children/)).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

it("does not return placeholder styles when isPending is false", async () => {
  const { rerender } = render(<Placeholder>Placeholder children</Placeholder>);
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();
  rerender(<Placeholder isPending>Placeholder children</Placeholder>);
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
});
