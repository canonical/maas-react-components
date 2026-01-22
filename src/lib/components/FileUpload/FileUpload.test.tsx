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
        onFileUpload={mockOnFileUpload}
        files={[]}
        rejectedFiles={[]}
        removeFile={vi.fn()}
        removeRejectedFile={vi.fn()}
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
        files={[file]}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
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
        removeFile={mockRemoveFile}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
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
        rejectedFiles={[rejection]}
        files={[]}
        onFileUpload={vi.fn()}
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
        rejectedFiles={[rejection]}
        removeRejectedFile={mockRemoveRejectedFile}
        files={[]}
        onFileUpload={vi.fn()}
        removeFile={vi.fn()}
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
        maxFiles={1}
        rejectedFiles={[]}
        onFileUpload={vi.fn()}
        removeFile={vi.fn()}
        removeRejectedFile={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("Drag and drop files here or click to upload"),
    ).not.toBeInTheDocument();
  });

  it("can display errors on the dropzone", () => {
    render(<FileUpload error="This is an error" />);

    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("can display a label", () => {
    render(<FileUpload label="Upload files" />);

    expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
  });

  it("can display help text", () => {
    render(<FileUpload help="Some helpful text" />);

    expect(screen.getByText("Some helpful text")).toBeInTheDocument();
  });

  it("works in uncontrolled mode with internal state management", async () => {
    // Render component without any state props - it should use internal state
    render(<FileUpload maxFiles={2} />);

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
});
