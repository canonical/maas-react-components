import { render, screen } from "@testing-library/react";

import { LimitedInput } from "./LimitedInput";

const { getComputedStyle } = window;

beforeAll(() => {
  // getComputedStyle is not implemeneted in jsdom, so we need to do this.
  window.getComputedStyle = (elt) => getComputedStyle(elt);
});

afterAll(() => {
  // Reset to original implementation
  window.getComputedStyle = getComputedStyle;
});

it("renders without crashing", async () => {
  render(<LimitedInput aria-label="Limited input" immutableText="Some text" />);

  expect(
    screen.getByRole("textbox", { name: "Limited input" }),
  ).toBeInTheDocument();
});

it("sets the --immutable css variable to the provided immutable text", async () => {
  const { rerender } = render(
    <LimitedInput aria-label="Limited input" immutableText="Some text" />,
  );

  rerender(
    <LimitedInput aria-label="Limited input" immutableText="Some text" />,
  );

  expect(
    screen.getByRole("textbox", { name: "Limited input" }).parentElement
      ?.parentElement,
  ).toHaveStyle(`--immutable: "Some text";`);
});
