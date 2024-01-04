import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { FileUpload } from "./FileUpload";
beforeEach(() => {});

function createDataTransfer(file: File) {
  return {
    files: [file],
    items: [
      {
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      },
    ],
    types: ["Files"],
  };
}

it("renders without crashing", () => {
  render(<FileUpload onFileUpload={vi.fn()} />);
  expect(
    screen.getByText("Drag and drop files here or click to upload"),
  ).toBeInTheDocument();
});

it("calls onFileUpload when files are dropped", async () => {
  const mockOnFileUpload = vi.fn();
  render(<FileUpload onFileUpload={mockOnFileUpload} />);
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const dropEvent = await fireEvent.drop(
    screen.getByText("Drag and drop files here or click to upload"),
    {
      dataTransfer: createDataTransfer(file),
    },
  );

  expect(dropEvent).toMatchInlineSnapshot("false");
  await waitFor(() =>
    expect(mockOnFileUpload).toHaveBeenCalledWith(
      [file],
      expect.anything(),
      expect.anything(),
    ),
  );
});
