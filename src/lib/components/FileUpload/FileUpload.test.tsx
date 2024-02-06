import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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
  render(
    <FileUpload
      files={[]}
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );
  expect(
    screen.getByText("Drag and drop files here or click to upload"),
  ).toBeInTheDocument();
});

it("calls onFileUpload when files are dropped", async () => {
  const mockOnFileUpload = vi.fn();
  render(
    <FileUpload
      files={[]}
      onFileUpload={mockOnFileUpload}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );
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

it("displays accepted files", () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  render(
    <FileUpload
      files={[file]}
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(screen.getByText(file.name)).toBeInTheDocument();
});

it("calls removeFile when the 'remove' button is clicked", async () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const mockRemoveFile = vi.fn();

  render(
    <FileUpload
      files={[file]}
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={mockRemoveFile}
      removeRejectedFile={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

  expect(mockRemoveFile).toHaveBeenCalledWith(file);
});

it("displays rejected files and reasons", () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const rejection = {
    file,
    errors: [{ code: "an-error-code", message: "This is an error" }],
  };

  render(
    <FileUpload
      files={[]}
      onFileUpload={vi.fn()}
      rejectedFiles={[rejection]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(screen.getByText(file.name)).toBeInTheDocument();
  expect(screen.getByText("This is an error")).toBeInTheDocument();
});

it("calls removeRejectedFile when the 'remove' button is clicked", async () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const rejection = {
    file,
    errors: [{ code: "an-error-code", message: "This is an error" }],
  };
  const mockRemoveRejectedFile = vi.fn();

  render(
    <FileUpload
      files={[]}
      onFileUpload={vi.fn()}
      rejectedFiles={[rejection]}
      removeFile={vi.fn()}
      removeRejectedFile={mockRemoveRejectedFile}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

  expect(mockRemoveRejectedFile).toHaveBeenCalledWith(rejection);
});

it("hides the drop zone when the maximum number of files is met", () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  render(
    <FileUpload
      files={[file]}
      onFileUpload={vi.fn()}
      maxFiles={1}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(
    screen.queryByText("Drag and drop files here or click to upload"),
  ).not.toBeInTheDocument();
});

it("can display errors on the dropzone", () => {
  render(
    <FileUpload
      error={"This is an error"}
      files={[]}
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(screen.getByText("This is an error")).toBeInTheDocument();
});

it("can display a label", () => {
  render(
    <FileUpload
      files={[]}
      label="Upload files"
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
});

it("can display help text", () => {
  render(
    <FileUpload
      files={[]}
      help="Some helpful text"
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
    />,
  );

  expect(screen.getByText("Some helpful text")).toBeInTheDocument();
});
