import { render, screen } from "@testing-library/react";

import { InputGroup } from "./InputGroup";

it("renders children", () => {
  render(
    <InputGroup>
      <InputGroup.Label>Test Label</InputGroup.Label>
      <InputGroup.Description>Test Description</InputGroup.Description>
      Test Content
    </InputGroup>,
  );
  expect(screen.getByText("Test Label")).toBeInTheDocument();
  expect(screen.getByText("Test Description")).toBeInTheDocument();
  expect(screen.getByText("Test Content")).toBeInTheDocument();
});

it("has correct accessible label", () => {
  render(
    <InputGroup>
      <InputGroup.Label>Test Label</InputGroup.Label>Test Content
    </InputGroup>,
  );
  expect(
    screen.getByRole("group", { name: /Test Label/i }),
  ).toBeInTheDocument();
});

it("has correct accessible label and description", () => {
  render(
    <InputGroup>
      <InputGroup.Label>Test Label</InputGroup.Label>
      <InputGroup.Description>Test Description</InputGroup.Description>
    </InputGroup>,
  );
  expect(
    screen.getByRole("group", {
      name: /Test Label/i,
      description: /Test Description/i,
    }),
  ).toBeInTheDocument();
});
