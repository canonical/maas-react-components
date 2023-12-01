import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { Pagination } from "./Pagination";

it("renders without crashing", () => {
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );
  expect(screen.getByRole("navigation", { name: "pagination"})).toBeInTheDocument();
});

it("displays the current page number in the input box", () => {
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  expect(screen.getByRole("spinbutton")).toHaveValue(1);
})

it("disables the buttons and input box when the disabled prop is true", () => {
  render(
    <Pagination
      disabled={true}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  expect(screen.getByRole("spinbutton")).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
})

it("disables the 'Previous page' button when on the first page", () => {
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
})

it("disables the 'Next page' button when on the last page", () => {
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={10}
      totalPages={10}
    />,
  );

  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
})

it("can call a function when the 'Next page' button is pressed", async () => {
  const onNextClick = vi.fn();
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={onNextClick}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: "Next page" }));

  expect(onNextClick).toHaveBeenCalled();
})

it("can call a function when the 'Previous page' button is pressed", async () => {
  const onPreviousClick = vi.fn();
  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={onPreviousClick}
      currentPage={2}
      totalPages={10}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: "Previous page" }));

  expect(onPreviousClick).toHaveBeenCalled();
})

it("can call a function when the input box's value is changed", async () => {
  const onInputChange = vi.fn();

  render(
    <Pagination
      disabled={false}
      onInputBlur={vi.fn()}
      onInputChange={onInputChange}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  await userEvent.clear(screen.getByRole("spinbutton"));

  expect(onInputChange).toHaveBeenCalled();
})

it("can call a function when the input box is blurred", async () => {
  const onInputBlur = vi.fn();

  render(
    <Pagination
      disabled={false}
      onInputBlur={onInputBlur}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      currentPage={1}
      totalPages={10}
    />,
  );

  // focus the input
  await userEvent.click(screen.getByRole("spinbutton"));
  expect(onInputBlur).not.toHaveBeenCalled();

  // blur the input
  await userEvent.click(screen.getByText("of 10"));
  expect(onInputBlur).toHaveBeenCalled();
})
