import { render, screen } from "@testing-library/react";
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
