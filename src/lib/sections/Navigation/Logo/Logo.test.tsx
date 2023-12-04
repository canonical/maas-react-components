import { Button, Link } from "@canonical/react-components";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<Navigation.Logo>Navigation logo</Navigation.Logo>)
  expect(screen.getByText("Navigation logo")).toBeInTheDocument();
})

it("can be rendered as another component", () => {
  const { rerender } = render(<Navigation.Logo as={Button}>Navigation logo</Navigation.Logo>)
  expect(screen.getByRole("button", { name: "Navigation logo" })).toBeInTheDocument();

  rerender(<Navigation.Logo as={Link}>Navigation logo</Navigation.Logo>)
  expect(screen.queryByRole("button", { name: "Navigation logo" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Navigation logo" })).toBeInTheDocument();
})

it("can accept props for a required component", async () => {
  const onClick = vi.fn();
  render(<Navigation.Logo as={Button} onClick={onClick} >Navigation logo</Navigation.Logo>)
  await userEvent.click(screen.getByRole("button", { name: "Navigation logo" }));
  expect(onClick).toHaveBeenCalled();
})