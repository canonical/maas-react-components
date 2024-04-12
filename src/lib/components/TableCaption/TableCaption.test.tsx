import { render, screen } from "@testing-library/react";

import { TableCaption } from "./TableCaption";

test("TableCaption displays children as caption", () => {
  render(
    <table>
      <TableCaption>caption text</TableCaption>
    </table>,
  );
  expect(screen.getByText("caption text")).toBeInTheDocument();
  expect(
    screen.getByRole("table", { name: "caption text" }),
  ).toBeInTheDocument();
});

test("TableCaption.Title displays title", () => {
  render(<TableCaption.Title>Test Title</TableCaption.Title>);
  expect(screen.getByText("Test Title")).toBeInTheDocument();
});

test("TableCaption.Title displays title", () => {
  render(<TableCaption.Description>Test description</TableCaption.Description>);
  expect(screen.getByText("Test description")).toBeInTheDocument();
});
