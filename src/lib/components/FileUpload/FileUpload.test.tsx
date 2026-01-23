import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { FileUpload } from "@/lib";

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

describe("FileUpload", () => {
  it("renders without crashing", () => {
    render(<FileUpload />);

    expect(
      screen.getByText("Drag and drop files here or click to upload"),
    ).toBeInTheDocument();
  });

  it("calls onFileUpload when files are dropped", async () => {
    const mockOnFileUpload = vi.fn();
    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        onFileUpload={mockOnFileUpload}
        files={[]}
        rejectedFiles={[]}
        onRemoveFile={vi.fn()}
      />,
    );
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

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        files={[file]}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
        onRemoveFile={vi.fn()}
      />,
    );

    expect(screen.getByText(file.name)).toBeInTheDocument();
  });

  it("calls removeFile when the 'remove' button is clicked", async () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const mockRemoveFile = vi.fn();

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        files={[file]}
        onRemoveFile={mockRemoveFile}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

    expect(mockRemoveFile).toHaveBeenCalledWith(file);
  });

  it("displays rejected files", () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const rejection = {
      file,
      errors: [{ code: "an-error-code", message: "This is an error" }],
    };

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        rejectedFiles={[rejection]}
        files={[]}
        onFileUpload={vi.fn()}
        onRemoveFile={vi.fn()}
      />,
    );

    expect(screen.getByText(file.name)).toBeInTheDocument();
    expect(screen.getByText(file.name)).toHaveClass("is-rejected");
  });

  it("hides the drop zone when the maximum number of files is met", () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        files={[file]}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
        onRemoveFile={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("Drag and drop files here or click to upload"),
    ).not.toBeInTheDocument();
  });

  it("can display errors on the dropzone", () => {
    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        error="This is an error"
      />,
    );

    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("can display a label", () => {
    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        label="Upload files"
      />,
    );

    expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
  });

  it("can display help text", () => {
    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        help="Some helpful text"
      />,
    );

    expect(screen.getByText("Some helpful text")).toBeInTheDocument();
  });

  it("works in uncontrolled mode with internal state management", async () => {
    // Render component without any state props - it should use internal state
    render(<FileUpload maxFiles={1} maxSize={2000} minSize={0} />);

    expect(
      screen.getByText("Drag and drop files here or click to upload"),
    ).toBeInTheDocument();

    // Drop a file
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await fireEvent.drop(
      screen.getByText("Drag and drop files here or click to upload"),
      {
        dataTransfer: createDataTransfer([file]),
      },
    );

    // The file should appear in the list (managed by internal state)
    await waitFor(() => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    });

    // Remove button should be present
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();

    // Click remove button
    await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

    // File should be removed from the list
    await waitFor(() => {
      expect(screen.queryByText(file.name)).not.toBeInTheDocument();
    });
  });

  it("calls onRemove when removing accepted files", async () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const mockOnRemove = vi.fn();

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        files={[file]}
        onRemoveFile={mockOnRemove}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

    expect(mockOnRemove).toHaveBeenCalledWith(file);
  });

  it("calls onRemove when removing rejected files", async () => {
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const rejection = {
      file,
      errors: [{ code: "file-too-large", message: "File is too large" }],
    };
    const mockOnRemove = vi.fn();

    render(
      <FileUpload
        maxFiles={1}
        maxSize={2000}
        minSize={0}
        rejectedFiles={[rejection]}
        onRemoveFile={mockOnRemove}
        files={[]}
        onFileUpload={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Remove/i }));

    expect(mockOnRemove).toHaveBeenCalledWith(rejection);
  });
});
