import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { NavigationBar } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(<NavigationBar.MenuButton onClick={vi.fn}>Menu</NavigationBar.MenuButton>);
  expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
});

it("calls the provided function on click", async () => {
  const onClick = vi.fn();
  render(<NavigationBar.MenuButton onClick={onClick}>Menu</NavigationBar.MenuButton>);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(onClick).toHaveBeenCalled();
});
