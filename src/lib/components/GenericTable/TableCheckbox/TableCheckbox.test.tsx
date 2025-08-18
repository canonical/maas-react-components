import type { Row } from "@tanstack/react-table";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, vi } from "vitest";

import TableCheckbox from "./TableCheckbox";

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
};
const getMockRow = (rowProps: Partial<Row<Image>> = {}) => {
  return Object.assign(
    {
      getIsSelected: vi.fn(() => false),
      getIsAllSubRowsSelected: vi.fn(() => false),
      getIsSomeSelected: vi.fn(() => false),
      getCanSelect: vi.fn(() => true),
      getIsGrouped: vi.fn(() => true),
      toggleSelected: vi.fn(),
      subRows: [
        {
          toggleSelected: vi.fn(),
          id: 0,
          release: "16.04 LTS",
          architecture: "amd64",
          name: "Ubuntu",
          size: "1.3 MB",
          lastSynced: "Mon, 06 Jan. 2025 10:45:24",
          canDeployToMemory: true,
          status: "Synced",
        },
        {
          toggleSelected: vi.fn(),
          id: 1,
          release: "18.04 LTS",
          architecture: "arm64",
          name: "Ubuntu",
          size: "1.3 MB",
          lastSynced: "Mon, 06 Jan. 2025 10:45:24",
          canDeployToMemory: true,
          status: "Synced",
        },
      ],
    },
    rowProps,
  );
};

describe("TableCheckbox.All", () => {
  const selectable = (selected = false) =>
    getMockRow({
      getCanSelect: vi.fn(() => true),
      getIsSelected: vi.fn(() => selected),
      subRows: [],
    }) as unknown as Row<Image>;

  const nonSelectable = () =>
    getMockRow({
      getCanSelect: vi.fn(() => false),
      getIsSelected: vi.fn(() => false),
      subRows: [],
    }) as unknown as Row<Image>;

  const renderSelectAllCheckbox = (rows: Row<Image>[]) => {
    const mockTable = {
      getCoreRowModel: vi.fn(() => ({ rows })),
      getSelectedRowModel: vi.fn(() => ({
        rows: rows.filter((r) => r.getIsSelected()),
      })),
    };

    return {
      // @ts-expect-error partial mock is sufficient for the component
      ...render(<TableCheckbox.All table={mockTable} />),
      mockTable,
      rows,
    };
  };

  it("displays 'unchecked' when no selectable rows are selected", () => {
    renderSelectAllCheckbox([selectable(false), selectable(false)]);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("displays 'mixed' when some selectable rows are selected", () => {
    renderSelectAllCheckbox([selectable(true), selectable(false)]);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("displays 'checked' when all selectable rows are selected", () => {
    renderSelectAllCheckbox([selectable(true), selectable(true)]);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("is disabled when there are no selectable rows", () => {
    renderSelectAllCheckbox([nonSelectable(), nonSelectable()]);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("toggles only selectable rows on click", async () => {
    const r1 = selectable(false);
    const r2 = selectable(false);
    const r3 = nonSelectable(); // should NOT be toggled
    renderSelectAllCheckbox([r1, r2, r3]);

    await userEvent.click(screen.getByRole("checkbox"));

    expect(r1.toggleSelected).toHaveBeenCalledWith(true);
    expect(r2.toggleSelected).toHaveBeenCalledWith(true);
    expect(r3.toggleSelected).not.toHaveBeenCalled();
  });
});

describe("TableCheckbox.Group", () => {
  const selectableSub = (selected = false) =>
    getMockRow({
      getCanSelect: vi.fn(() => true),
      getIsSelected: vi.fn(() => selected),
      subRows: [], // leaf
    }) as unknown as Row<Image>;

  const nonSelectableSub = () =>
    getMockRow({
      getCanSelect: vi.fn(() => false),
      getIsSelected: vi.fn(() => false),
      subRows: [],
    }) as unknown as Row<Image>;

  const renderSelectGroupCheckbox = (rowProps: Partial<Row<Image>> = {}) => {
    const row = getMockRow({
      getCanSelect: vi.fn(() => true),
      subRows: [selectableSub(false), selectableSub(false)],
      ...rowProps,
    }) as unknown as Row<Image>;

    return { ...render(<TableCheckbox.Group row={row} />), row };
  };

  it("is enabled when row can be selected", () => {
    renderSelectGroupCheckbox({ getCanSelect: vi.fn(() => true) });
    expect(screen.getByRole("checkbox")).toBeEnabled();
  });

  it("is disabled when neither row nor sub-rows are selectable", () => {
    renderSelectGroupCheckbox({
      getCanSelect: vi.fn(() => false),
      subRows: [nonSelectableSub(), nonSelectableSub()],
    });
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("shows mixed state when some selectable sub-rows are selected", () => {
    renderSelectGroupCheckbox({
      subRows: [selectableSub(true), selectableSub(false)],
    });
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("shows checked when all selectable sub-rows are selected", () => {
    renderSelectGroupCheckbox({
      subRows: [selectableSub(true), selectableSub(true)],
    });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles only selectable sub-rows", async () => {
    const s1 = selectableSub(false);
    const s2 = nonSelectableSub(); // should NOT be toggled
    renderSelectGroupCheckbox({ subRows: [s1, s2] });

    await userEvent.click(screen.getByRole("checkbox"));

    expect(s1.toggleSelected).toHaveBeenCalledWith(true);
    expect(s2.toggleSelected).not.toHaveBeenCalled();
  });
});

describe("TableCheckbox", () => {
  const renderIndividualCheckbox = (rowProps: Partial<Row<Image>> = {}) => {
    const mockRow = {
      getIsSelected: vi.fn(() => false),
      getCanSelect: vi.fn(() => true),
      getToggleSelectedHandler: vi.fn(),
      ...rowProps,
    };
    return {
      ...render(
        // @ts-expect-error we're not mocking the entire row object, just the parts we need
        <TableCheckbox row={mockRow} disabledTooltip={"Option disabled."} />,
      ),
      mockRow,
    };
  };

  it("is enabled when row can be selected", () => {
    renderIndividualCheckbox();
    expect(screen.getByRole("checkbox")).toBeEnabled();
  });

  it("is disabled when row cannot be selected", () => {
    renderIndividualCheckbox({ getCanSelect: vi.fn(() => false) });
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("displays tooltip when disabled", async () => {
    renderIndividualCheckbox({ getCanSelect: vi.fn(() => false) });
    expect(screen.getByRole("checkbox")).toBeDisabled();
    await userEvent.hover(screen.getByRole("checkbox"));
    await waitFor(() => {
      expect(screen.getByText("Option disabled.")).toBeInTheDocument();
    });
  });

  it("calls the toggle handler on click", async () => {
    const { mockRow } = renderIndividualCheckbox();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(mockRow.getToggleSelectedHandler).toHaveBeenCalled();
  });
});
