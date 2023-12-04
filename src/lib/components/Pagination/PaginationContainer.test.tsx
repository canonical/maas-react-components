import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { PaginationContainer } from "./Pagination";

it("renders without crashing", () => {
  render(
    <PaginationContainer
      currentPage={1}
      disabled={false}
      paginate={vi.fn()}
      totalPages={10}
    />,
  );

  expect(screen.getByRole("navigation", { name: "pagination"})).toBeInTheDocument();
});

it("calls the 'paginate' function when the 'Next page' button is clicked", async () => {
  const paginate = vi.fn();

  render(
    <PaginationContainer
      currentPage={1}
      disabled={false}
      paginate={paginate}
      totalPages={10}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: "Next page" }));

  expect(paginate).toHaveBeenCalledWith(2);
});

it("calls the 'paginate' function when the 'Previous page' button is clicked", async () => {
  const paginate = vi.fn();

  render(
    <PaginationContainer
      currentPage={10}
      disabled={false}
      paginate={paginate}
      totalPages={10}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: "Previous page" }));

  expect(paginate).toHaveBeenCalledWith(9);
});

it("calls the 'paginate' function when the input box's value is changed", () => {
  const paginate = vi.fn();

  render(
    <PaginationContainer
      currentPage={1}
      disabled={false}
      paginate={paginate}
      totalPages={10}
    />,
  );

  const pageInput = screen.getByRole("spinbutton", { name: "page number" });

  // Using userEvent to clear this first doesn't work, so we have to use fireEvent instead.
  fireEvent.change(pageInput, { target: { value: "4" } });

  expect(paginate).toHaveBeenCalledWith(4);
});

it("displays an error if an invalid page number is entered", () => {
  const paginate = vi.fn();

  render(
    <PaginationContainer
      currentPage={1}
      disabled={false}
      paginate={paginate}
      totalPages={10}
    />,
  );

  const pageInput = screen.getByRole("spinbutton", { name: "page number" });

  // Using userEvent to clear this first doesn't work, so we have to use fireEvent instead.
  fireEvent.change(pageInput, { target: { value: "12" } });

  expect(paginate).not.toHaveBeenCalled();
  expect(screen.getByText("12 is not a valid page number.")).toBeInTheDocument();
});

it("displays an error if no page number is entered", async () => {
  const paginate = vi.fn();

  render(
    <PaginationContainer
      currentPage={1}
      disabled={false}
      paginate={paginate}
      totalPages={10}
    />,
  );

  await userEvent.clear(screen.getByRole("spinbutton"));

  expect(paginate).not.toHaveBeenCalled();
  expect(screen.getByText("Enter a page number.")).toBeInTheDocument();
});
