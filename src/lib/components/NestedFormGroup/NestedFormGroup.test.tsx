import { Input } from "@canonical/react-components";
import { render, screen } from "@testing-library/react";

import { NestedFormGroup } from "./NestedFormGroup";

it("renders children", () => {
  render(
    <NestedFormGroup aria-hidden={false}>
      <Input label="Test Input" type="radio" />
    </NestedFormGroup>,
  );

  expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
});

it("passes aria-hidden prop", () => {
  const { container } = render(
    <NestedFormGroup aria-hidden={true}>
      <Input label="Test Input" type="radio" />
    </NestedFormGroup>,
  );

  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
});
