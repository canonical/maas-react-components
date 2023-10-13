import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { ExternalLink } from "./ExternalLink";

test("renders with correct attributes", () => {
  render(<ExternalLink to="https://example.com">Example Link</ExternalLink>);

  const linkElement = screen.getByText(/example link/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute("rel", "noreferrer noopener");
  expect(linkElement).toHaveAttribute("href", "https://example.com");
  expect(linkElement).toHaveAttribute("target", "_blank");
});

test("calls onClick handler when pressed", async () => {
  const handleClick = vi.fn();

  render(
    <ExternalLink onClick={handleClick} to="https://example.com">
      Example Link
    </ExternalLink>,
  );

  const linkElement = screen.getByText(/example link/i);
  await userEvent.click(linkElement);

  expect(handleClick).toHaveBeenCalled();
});
