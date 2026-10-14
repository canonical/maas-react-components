import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders the group label", () => {
  render(
    <Navigation.Group isExpanded={false} label="Hardware" setIsExpanded={vi.fn()}>
      <Navigation.Item>
        <Navigation.Link href="#">Machines</Navigation.Link>
      </Navigation.Item>
    </Navigation.Group>,
  );
  expect(screen.getByText("Hardware")).toBeInTheDocument();
});

it("renders an icon when provided", () => {
  const { container } = render(
    <Navigation.Group icon="machines" isExpanded={false} label="Hardware" setIsExpanded={vi.fn()}>
      <Navigation.Item>
        <Navigation.Link href="#">Machines</Navigation.Link>
      </Navigation.Item>
    </Navigation.Group>,
  );
  expect(container.querySelector(".p-icon--machines")).toBeInTheDocument();
});

it("reflects the expanded state on the toggle button and nested list", () => {
  render(
    <Navigation.Group isExpanded label="Hardware" setIsExpanded={vi.fn()}>
      <Navigation.Item>
        <Navigation.Link href="#">Machines</Navigation.Link>
      </Navigation.Item>
    </Navigation.Group>,
  );
  expect(
    screen.getByRole("button", { name: "hide submenu for Hardware" }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("Machines").closest("ul")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

it("calls setIsExpanded with the toggled value when clicked", async () => {
  const setIsExpanded = vi.fn();
  render(
    <Navigation.Group isExpanded={false} label="Hardware" setIsExpanded={setIsExpanded}>
      <Navigation.Item>
        <Navigation.Link href="#">Machines</Navigation.Link>
      </Navigation.Item>
    </Navigation.Group>,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "show submenu for Hardware" }),
  );
  expect(setIsExpanded).toHaveBeenCalledWith(true);
});
