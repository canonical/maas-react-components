import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Pagination } from "./Pagination";

it("renders without crashing", () => {
  render(
    <Pagination
      currentPage={1}
      isLoading={false}
      onInputBlur={vi.fn()}
      onInputChange={vi.fn()}
      onNextClick={vi.fn()}
      onPreviousClick={vi.fn()}
      noItems={false}
      totalPages={10}
    />,
  );
  expect(screen.getByRole("navigation", { name: "pagination"})).toBeInTheDocument();
});
