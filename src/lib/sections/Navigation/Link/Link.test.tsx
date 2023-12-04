
import { Button, Link } from "@canonical/react-components";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Link>Navigation link</Navigation.Link>)
  expect(screen.getByText("Navigation link")).toBeInTheDocument();
})

it("can be rendered as another component", () => {
  const { rerender } = render(<Navigation.Link as={Button}>Navigation link</Navigation.Link>)
  expect(screen.getByRole("button", { name: "Navigation link" })).toBeInTheDocument();

  rerender(<Navigation.Link as={Link}>Navigation link</Navigation.Link>)
  expect(screen.queryByRole("button", { name: "Navigation link" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Navigation link" })).toBeInTheDocument();
})

it("can accept props for a required component", async () => {
  const onClick = vi.fn();
  render(<Navigation.Link as={Button} onClick={onClick} >Navigation link</Navigation.Link>)
  await userEvent.click(screen.getByRole("button", { name: "Navigation link" }));
  expect(onClick).toHaveBeenCalled();
})
