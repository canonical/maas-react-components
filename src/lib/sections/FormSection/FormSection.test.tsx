import { render, screen } from "@testing-library/react";

import { FormSection } from "./FormSection";

it("renders children correctly", () => {
  render(<FormSection>Test</FormSection>);
  expect(screen.getByText("Test")).toBeInTheDocument();
});

it("renders content correctly", () => {
  render(
    <FormSection>
      <FormSection.Title>Test Title</FormSection.Title>
      <FormSection.Description>Test Description</FormSection.Description>
      <FormSection.Content>Test Content</FormSection.Content>
    </FormSection>,
  );
  expect(screen.getByText("Test Title")).toBeInTheDocument();
  expect(screen.getByText("Test Description")).toBeInTheDocument();
  expect(screen.getByText("Test Content")).toBeInTheDocument();
});
