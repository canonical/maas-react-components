import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { FileUpload, FileUploadProps } from "./FileUpload";
beforeEach(() => {});

function createDataTransfer(files: File[]) {
  return {
    files: files,
    items: files.map((file) => ({
      kind: "file",
      type: file.type,
      getAsFile: () => file,
    })),
    types: ["Files"],
  };
}

const renderFileUpload = (options?: Partial<FileUploadProps>) => {
  return render(
    <FileUpload
      files={[]}
      onFileUpload={vi.fn()}
      rejectedFiles={[]}
      removeFile={vi.fn()}
      removeRejectedFile={vi.fn()}
      {...options}
    />,
  );
};

it("renders without crashing", () => {
  renderFileUpload();

  expect(
    screen.getByText("Drag and drop files here or click to upload"),
  ).toBeInTheDocument();
});

it("calls onFileUpload when files are dropped", async () => {
  const mockOnFileUpload = vi.fn();
  renderFileUpload({ onFileUpload: mockOnFileUpload });
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const dropEvent = await fireEvent.drop(
    screen.getByText("Drag and drop files here or click to upload"),
    {
      dataTransfer: createDataTransfer([file]),
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

  renderFileUpload({ files: [file] });

  expect(screen.getByText(file.name)).toBeInTheDocument();
});

it("calls removeFile when the 'remove' button is clicked", async () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const mockRemoveFile = vi.fn();

  renderFileUpload({ files: [file], removeFile: mockRemoveFile });

  await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

  expect(mockRemoveFile).toHaveBeenCalledWith(file);
});

it("displays rejected files and reasons", () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const rejection = {
    file,
    errors: [{ code: "an-error-code", message: "This is an error" }],
  };

  renderFileUpload({ rejectedFiles: [rejection] });

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

  renderFileUpload({
    rejectedFiles: [rejection],
    removeRejectedFile: mockRemoveRejectedFile,
  });

  await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

  expect(mockRemoveRejectedFile).toHaveBeenCalledWith(rejection);
});

it("hides the drop zone when the maximum number of files is met", () => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  renderFileUpload({ files: [file], maxFiles: 1 });

  expect(
    screen.queryByText("Drag and drop files here or click to upload"),
  ).not.toBeInTheDocument();
});

it("can display errors on the dropzone", () => {
  renderFileUpload({ error: "This is an error" });

  expect(screen.getByText("This is an error")).toBeInTheDocument();
});

it("can display a label", () => {
  renderFileUpload({ label: "Upload files" });

  expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
});

it("can display help text", () => {
  renderFileUpload({ help: "Some helpful text" });

  expect(screen.getByText("Some helpful text")).toBeInTheDocument();
});
