import { useRef } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { GenericTable } from "@/lib";
import type { PaginationBarProps } from "@/lib/components/GenericTable/PaginationBar";

type Image = {
  id: number;
  release: string;
  architecture: string;
  name: string;
  size: string;
  lastSynced: string | null;
  canDeployToMemory: boolean;
  status: string;
  lastDeployed: string;
  machines: number;
  children?: Image[];
};

describe("GenericTable", () => {
  // Set up ResizeObserver mock before each test
  beforeEach(() => {
    // Mock the ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock window event listeners
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  const columns: ColumnDef<Image, Partial<Image>>[] = [
    {
      id: "release",
      accessorKey: "release",
      enableSorting: true,
      header: () => "Release title",
    },
    {
      id: "architecture",
      accessorKey: "architecture",
      enableSorting: false,
      header: () => "Architecture",
    },
    {
      id: "size",
      accessorKey: "size",
      enableSorting: false,
      header: () => "Size",
    },
  ];

  const data: Image[] = [
    {
      id: 0,
      release: "16.04 LTS",
      architecture: "amd64",
      name: "Ubuntu",
      size: "1.3 MB",
      lastSynced: "Mon, 06 Jan. 2025 10:45:24",
      canDeployToMemory: true,
      status: "Synced",
      lastDeployed: "Thu, 15 Aug. 2019 06:21:39",
      machines: 2,
    },
    {
      id: 1,
      release: "18.04 LTS",
      architecture: "arm64",
      name: "Ubuntu",
      size: "1.3 MB",
      lastSynced: "Mon, 06 Jan. 2025 10:45:24",
      canDeployToMemory: true,
      status: "Synced",
      lastDeployed: "Thu, 15 Aug. 2019 06:21:39",
      machines: 2,
    },
  ];

  it("renders a table with provided columns and data", () => {
    render(
      <GenericTable
        aria-label="Images"
        columns={columns}
        data={data}
        isLoading={false}
      />,
    );

    expect(screen.getByRole("grid", { name: "Images" })).toBeInTheDocument();

    expect(screen.getByText("Release title")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();

    expect(screen.getByText("16.04 LTS")).toBeInTheDocument();
    expect(screen.getByText("18.04 LTS")).toBeInTheDocument();
  });

  it("renders correctly when there is no data", () => {
    render(
      <GenericTable
        columns={columns}
        data={[]}
        isLoading={false}
        noData={<span>No data</span>}
      />,
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    render(<GenericTable columns={columns} data={data} isLoading={true} />);

    const table = screen.getByRole("grid");
    expect(table).toHaveAttribute("aria-busy", "true");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("navigates to next and previous pages correctly", async () => {
    const setPagination = vi.fn();
    const pagination: PaginationBarProps = {
      currentPage: 1,
      dataContext: "image",
      handlePageSizeChange: vi.fn(),
      isPending: false,
      itemsPerPage: 1,
      setCurrentPage: setPagination,
      totalItems: 2,
    };

    const { rerender } = render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        pagination={pagination}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(setPagination).toHaveBeenCalledWith(2);

    rerender(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        pagination={{ ...pagination, currentPage: 2 }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Previous page" }),
    );
    expect(setPagination).toHaveBeenCalledWith(1);
  });

  it("respects page size and updates when changed", async () => {
    const setPageSize = vi.fn();
    const pagination: PaginationBarProps = {
      currentPage: 1,
      dataContext: "image",
      handlePageSizeChange: setPageSize,
      isPending: false,
      itemsPerPage: 1,
      pageSizes: [1, 2],
      setCurrentPage: vi.fn(),
      totalItems: 2,
    };

    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        pagination={pagination}
      />,
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Items per page" }),
      "2/page",
    );

    await waitFor(() => {
      expect(setPageSize).toHaveBeenCalledWith(2);
    });
  });

  it("applies initial sorting configuration", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        sorting={[{ id: "release", desc: true }]}
      />,
    );

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];
    expect(firstDataRow).toHaveTextContent("18.04 LTS");
  });

  it("applies sorting when a sortable header is clicked", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        sorting={[{ id: "release", desc: true }]}
      />,
    );

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("18.04 LTS");
    expect(rows[2]).toHaveTextContent("16.04 LTS");

    await userEvent.click(screen.getByText("Release title"));

    const sortedRows = screen.getAllByRole("row");
    expect(sortedRows[1]).toHaveTextContent("16.04 LTS");
    expect(sortedRows[2]).toHaveTextContent("18.04 LTS");
  });

  it("externally reflects sorting", async () => {
    const mockSetSorting = vi.fn();
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        sorting={[{ id: "release", desc: true }]}
        setSorting={mockSetSorting}
      />,
    );

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("18.04 LTS");
    expect(rows[2]).toHaveTextContent("16.04 LTS");

    await userEvent.click(screen.getByText("Release title"));

    expect(mockSetSorting).toHaveBeenCalled();

    const sortedRows = screen.getAllByRole("row");
    expect(sortedRows[1]).toHaveTextContent("16.04 LTS");
    expect(sortedRows[2]).toHaveTextContent("18.04 LTS");
  });

  it("respects filter rules for which cells are rendered", () => {
    const customFilterCells = vi.fn((_row, column) => column.id !== "size");
    const customFilterHeaders = vi.fn((header) => header.id !== "size");

    render(
      <GenericTable
        columns={columns}
        data={data}
        filterCells={customFilterCells}
        filterHeaders={customFilterHeaders}
        isLoading={false}
        // rowSelection={{}}
        // setRowSelection={vi.fn()}
      />,
    );

    expect(screen.queryByText("Size")).not.toBeInTheDocument();

    expect(screen.queryByText("1.3 MB")).not.toBeInTheDocument();

    expect(screen.getByText("Release title")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();

    expect(customFilterCells).toHaveBeenCalled();
    expect(customFilterHeaders).toHaveBeenCalled();
  });

  it("renders checkboxes for row selection when selection is enabled", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toEqual(3);
  });

  it("selects and deselects a row when its checkbox is toggled", async () => {
    const mockSetRowSelection = vi.fn();
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelection: {},
          setRowSelection: mockSetRowSelection,
        }}
      />,
    );

    const [_, rowCheckbox] = screen.getAllByRole("checkbox");
    await userEvent.click(rowCheckbox);
    expect(mockSetRowSelection).toHaveBeenCalled();

    await userEvent.click(rowCheckbox);
    expect(mockSetRowSelection).toHaveBeenCalledTimes(2);
  });

  it("selects all rows when header checkbox is clicked", async () => {
    const mockSetRowSelection = vi.fn();
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelection: {},
          setRowSelection: mockSetRowSelection,
        }}
      />,
    );

    const [headerCheckbox] = screen.getAllByRole("checkbox");
    await userEvent.click(headerCheckbox);
    expect(mockSetRowSelection).toHaveBeenCalled();
  });

  it("disables rows that do not match canSelect predicate", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: (row) => row.original.architecture !== "arm64",
          disabledSelectionTooltip: "Cannot select arm64 architecture images.",
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    expect(checkboxes[1]).not.toBeDisabled();
    expect(checkboxes[2]).toBeDisabled();

    await userEvent.hover(checkboxes[2]);
    await waitFor(() => {
      expect(
        screen.getByText("Cannot select arm64 architecture images."),
      ).toBeInTheDocument();
    });
  });

  it("shows tooltip text when selection is disabled via canSelect", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: (row) => row.original.architecture !== "arm64",
          disabledSelectionTooltip: "Cannot select arm64 architecture images.",
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[2]).toBeDisabled();

    await userEvent.hover(checkboxes[2]);
    await waitFor(() => {
      expect(
        screen.getByText("Cannot select arm64 architecture images."),
      ).toBeInTheDocument();
    });
  });

  it("renders correctly when all rows are disabled via canSelect", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: (_) => false,
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
  });

  it("applies aria-labels to row checkboxes using rowSelectionLabelKey", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelectionLabelKey: "release",
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const firstRow = screen.getAllByRole("row")[1];

    expect(within(firstRow).getByRole("checkbox")).toHaveAccessibleName(
      "select 16.04 LTS",
    );
  });

  it("applies aria-labels to group checkboxes from the group key", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        groupBy={["release"]}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const firstGroupRow = screen.getAllByRole("row")[1];

    expect(within(firstGroupRow).getByRole("checkbox")).toHaveAccessibleName(
      "select 16.04 LTS",
    );
  });

  it("renders grouped rows when grouping is applied", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        groupBy={["release"]}
        isLoading={false}
      />,
    );

    const groupRows = screen
      .getAllByRole("row")
      .filter((row) => row.classList.contains("p-generic-table__group-row"));
    expect(groupRows.length).toBeGreaterThan(0);
  });

  it("toggles expansion of grouped rows when header is clicked", async () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        groupBy={["release"]}
        isLoading={false}
      />,
    );

    const expandButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.getAttribute("aria-label")?.includes("expand") ||
          button.getAttribute("aria-label")?.includes("collapse"),
      );

    if (expandButtons.length) {
      const initialRows = screen.getAllByRole("row").length;
      await userEvent.click(expandButtons[0]);
      const rowsAfterClick = screen.getAllByRole("row").length;

      expect(rowsAfterClick).toBeGreaterThan(initialRows);
    }
  });

  it("renders nested rows", () => {
    render(
      <GenericTable
        columns={columns}
        data={[
          {
            ...data[0],
            children: [data[1]],
          },
        ]}
        getSubRows={(originalRow) => originalRow.children}
        isLoading={false}
        selection={{
          canSelect: true,
          rowSelection: {},
          setRowSelection: vi.fn(),
        }}
      />,
    );

    const nestedRows = screen
      .getAllByRole("row")
      .filter((row) => row.classList.contains("p-generic-table__nested-row"));
    expect(nestedRows.length).toBeGreaterThan(0);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toEqual(3);
    expect(checkboxes[0]).not.toBeDisabled();
    expect(checkboxes[1]).not.toBeDisabled();
    expect(checkboxes[2]).toBeDisabled();
  });

  it("renders pinned rows correctly", () => {
    const extendedData = [
      ...data,
      {
        id: 2,
        release: "20.04 LTS",
        architecture: "armhf",
        name: "Ubuntu",
        size: "1.5 MB",
        lastSynced: "Mon, 06 Jan. 2025 10:45:24",
        canDeployToMemory: true,
        status: "Synced",
        lastDeployed: "Thu, 15 Aug. 2019 06:21:39",
        machines: 1,
      },
    ];

    const { rerender } = render(
      <GenericTable
        columns={columns}
        data={extendedData}
        groupBy={["architecture"]}
        isLoading={false}
        pinGroup={[{ value: "arm64", isTop: true }]}
      />,
    );

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("arm64");

    rerender(
      <GenericTable
        columns={columns}
        data={extendedData}
        groupBy={["architecture"]}
        isLoading={false}
        pinGroup={[{ value: "arm64", isTop: false }]}
      />,
    );

    const repinnedRows = screen.getAllByRole("row");
    expect(repinnedRows[1]).not.toHaveTextContent("arm64");
    expect(repinnedRows[repinnedRows.length - 1]).toHaveTextContent("arm64");
  });

  it("applies dynamic container sizing correctly", () => {
    render(
      <GenericTable
        columns={columns}
        data={data}
        isLoading={false}
        variant="regular"
      />,
    );

    const table = screen.getByRole("grid");
    expect(table).not.toHaveClass("p-generic-table__is-full-height");

    const containerRef = {
      current: {
        getBoundingClientRect: () => ({ bottom: 100, top: 0 }),
      } as HTMLElement,
    };

    Element.prototype.getBoundingClientRect = vi
      .fn()
      .mockImplementation(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (this.tagName === "TBODY") {
          return { top: 50, bottom: 300 };
        }
        return { top: 0, bottom: 0 };
      });

    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      get() {
        return this.tagName === "TBODY" ? 250 : 0;
      },
      configurable: true,
    });

    const { rerender } = render(
      <GenericTable
        containerRef={containerRef}
        columns={columns}
        data={data}
        isLoading={false}
        variant="full-height"
      />,
    );

    // Force a re-render to trigger useLayoutEffect
    rerender(
      <GenericTable
        containerRef={containerRef}
        columns={columns}
        data={data}
        isLoading={false}
        variant="full-height"
      />,
    );

    const fullHeightTable = screen.getAllByRole("grid")[1];
    expect(fullHeightTable).toHaveClass("p-generic-table__is-full-height");
  });

  it("uses containerRef for calculating table height", () => {
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement>(null);

      return (
        <div ref={containerRef} style={{ height: "500px" }}>
          <GenericTable
            columns={columns}
            containerRef={containerRef}
            data={data}
            isLoading={false}
          />
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByRole("grid")).toBeInTheDocument();

    expect(global.ResizeObserver).toHaveBeenCalled();

    expect(window.addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("applies custom class to table", () => {
    render(
      <GenericTable
        className="custom-table-class"
        columns={columns}
        data={data}
        isLoading={false}
      />,
    );

    const tableWrapper =
      screen.getByTestId("p-generic-table") ||
      screen.getByRole("grid").closest(".p-generic-table");
    expect(tableWrapper).toHaveClass("custom-table-class");
  });
});
