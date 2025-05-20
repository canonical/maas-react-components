import { useRef, useState } from "react";

import { Button, Icon } from "@canonical/react-components";
import { Meta, StoryObj } from "@storybook/react";
import {
  Column,
  Getter,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";

import { GenericTable } from "@/lib/components/GenericTable/GenericTable";
import { GroupRowActions } from "@/lib/components/GenericTable/GroupRowActions";

// Sample data for MAAS machines
const generateMachinesData = (count: number) => {
  const statuses = ["Ready", "Deployed", "Commissioning"];
  const zones = ["default", "zone-1", "zone-2", "zone-3"];
  const pools = ["default", "pool-1", "pool-2"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    fqdn: `machine-${i + 1}.maas`,
    ipAddress: `192.168.1.${i + 1}`,
    status: statuses[i % statuses.length],
    zone: zones[i % zones.length],
    pool: pools[i % pools.length],
  }));
};

// Column definitions for the MAAS machines table
const machineColumns = [
  {
    id: "fqdn",
    accessorKey: "fqdn",
    header: "FQDN",
  },
  {
    id: "ipAddress",
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }: { getValue: Getter<string> }) => (
      <span className={`status-${getValue().toLowerCase()}`}>{getValue()}</span>
    ),
  },
  {
    id: "zone",
    accessorKey: "zone",
    header: "Zone",
  },
  {
    id: "pool",
    accessorKey: "pool",
    header: "Pool",
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }: { row: Row<{ id: string | number }> }) => {
      if (row.getIsGrouped()) return <GroupRowActions row={row} />;
      return (
        <div className="actions-cell">
          <Button appearance="base" hasIcon>
            <Icon name="settings" />
          </Button>
          <Button appearance="base" hasIcon>
            <Icon name="delete" />
          </Button>
        </div>
      );
    },
  },
];

const mockMachineData = generateMachinesData(10);

const meta: Meta<typeof GenericTable> = {
  title: "Components/GenericTable",
  component: GenericTable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "GenericTable is a flexible table component built with TanStack Table that supports " +
          "selection, grouping, pagination, and more. It's designed to handle various data " +
          "display needs while maintaining a consistent design language.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    columns: machineColumns,
    data: mockMachineData.slice(0, 5),
    isLoading: false,
    variant: "regular",
  },
  argTypes: {
    // Main configuration
    columns: {
      description:
        "Column definitions that specify how to display and interact with table data",
      control: false,
      table: {
        type: { summary: "ColumnDef<T, Partial<T>>[]" },
        category: "Required",
      },
    },
    data: {
      description: "Array of data objects to be displayed in the table",
      control: false,
      table: {
        type: { summary: "T[]" },
        category: "Required",
      },
    },
    isLoading: {
      description:
        "Controls the loading state of the table. When true, displays placeholder content",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    variant: {
      description:
        "Determines the table layout style. 'full-height' takes up all available vertical space, 'regular' uses content-based height",
      control: { type: "radio" },
      options: ["full-height", "regular"],
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "full-height" },
        category: "Appearance",
      },
    },

    // Selection related
    canSelect: {
      description:
        "Enables row selection with checkboxes in the first column. When true, rowSelection and setRowSelection props must be provided",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Selection",
      },
    },
    rowSelection: {
      description:
        "State object that tracks which rows are currently selected. Required when canSelect is true",
      control: false,
      table: {
        type: { summary: "RowSelectionState" },
        category: "Selection",
        required: { condition: { name: "canSelect", value: true } },
      },
    },
    setRowSelection: {
      description:
        "State setter function for updating row selection. Required when canSelect is true",
      control: false,
      table: {
        type: { summary: "Dispatch<SetStateAction<RowSelectionState>>" },
        category: "Selection",
        required: { condition: { name: "canSelect", value: true } },
      },
    },

    // Grouping related
    groupBy: {
      description: "Array of column IDs to group rows by",
      control: false,
      table: {
        type: { summary: "string[]" },
        category: "Grouping",
      },
    },
    pinGroup: {
      description:
        "Configuration for pinning groups to top or bottom of the table",
      control: false,
      table: {
        type: { summary: "{ value: string; isTop: boolean }[]" },
        category: "Grouping",
      },
    },

    // Sorting
    sortBy: {
      description: "Initial sort configuration for table columns",
      control: false,
      table: {
        type: { summary: "ColumnSort[]" },
        category: "Sorting",
      },
    },

    // Filtering
    filterCells: {
      description: "Function to determine which cells should be displayed",
      control: false,
      table: {
        type: { summary: "Function" },
        category: "Filtering",
      },
    },
    filterHeaders: {
      description: "Function to determine which headers should be displayed",
      control: false,
      table: {
        type: { summary: "Function" },
        category: "Filtering",
      },
    },

    // Pagination
    pagination: {
      description:
        "Configuration for table pagination including current page, page size, and navigation handlers",
      control: false,
      table: {
        type: { summary: "PaginationBarProps" },
        category: "Pagination",
      },
    },

    // Styling and references
    className: {
      description: "Additional CSS class for the table wrapper",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    containerRef: {
      description: "Reference to container element for size calculations",
      control: false,
      table: {
        type: { summary: "RefObject<HTMLElement | null>" },
        defaultValue: { summary: "<main>" },
        category: "References",
      },
    },

    // Empty state
    noData: {
      description: "Custom content to display when the table has no data",
      control: false,
      table: {
        type: { summary: "ReactNode" },
        category: "Empty State",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GenericTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    data: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    noData: "No machines found",
  },
};

export const Selectable: Story = {
  render: (args) => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h5>Selected machines: {Object.keys(rowSelection).length}</h5>
          <div className="p-button-group">
            <Button
              appearance="negative"
              disabled={Object.keys(rowSelection).length === 0}
            >
              Delete
            </Button>
          </div>
        </div>
        <GenericTable
          {...args}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    );
  },
  args: {
    canSelect: true,
  },
};

export const Grouped: Story = {
  args: {
    columns: [
      {
        id: "status",
        accessorKey: "status",
        cell: ({
          row,
          getValue,
        }: {
          row: Row<{ id: string | number }>;
          getValue: Getter<string>;
        }) => {
          return (
            <div>
              <div>
                <strong>{getValue()}</strong>
              </div>
              <small className="u-text--muted">
                {`${row.getLeafRows().length} machine${row.getLeafRows().length > 1 ? "s" : ""}`}
              </small>
            </div>
          );
        },
      },
      ...machineColumns.filter((column) => column.id !== "status"),
    ],
    groupBy: ["status"],
    filterCells: (
      row: Row<{ id: string | number }>,
      column: Column<{ id: string | number }>,
    ): boolean => {
      if (row.getIsGrouped()) {
        return ["status", "actions"].includes(column.id);
      } else {
        return !["status"].includes(column.id);
      }
    },
    filterHeaders: (
      header: Header<{ id: string | number }, unknown>,
    ): boolean => header.column.id !== "status",
  },
};

export const GroupedSelectable: Story = {
  name: "Grouped (Selectable)",
  render: (args) => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h5>
            Selected machines:{" "}
            {
              Object.keys(rowSelection).filter(
                (key: string) => !isNaN(Number(key)),
              ).length
            }
          </h5>
          <div className="p-button-group">
            <Button
              appearance="negative"
              disabled={Object.keys(rowSelection).length === 0}
            >
              Delete
            </Button>
          </div>
        </div>
        <GenericTable
          {...args}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    );
  },
  args: {
    canSelect: true,
    columns: [
      {
        id: "status",
        accessorKey: "status",
        cell: ({
          row,
          getValue,
        }: {
          row: Row<{ id: string | number }>;
          getValue: Getter<string>;
        }) => {
          return (
            <div>
              <div>
                <strong>{getValue()}</strong>
              </div>
              <small className="u-text--muted">
                {`${row.getLeafRows().length} machine${row.getLeafRows().length > 1 ? "s" : ""}`}
              </small>
            </div>
          );
        },
      },
      ...machineColumns.filter((column) => column.id !== "status"),
    ],
    groupBy: ["status"],
    filterCells: (
      row: Row<{ id: string | number }>,
      column: Column<{ id: string | number }>,
    ): boolean => {
      if (row.getIsGrouped()) {
        return ["status", "actions"].includes(column.id);
      } else {
        return !["status"].includes(column.id);
      }
    },
    filterHeaders: (
      header: Header<{ id: string | number }, unknown>,
    ): boolean => header.column.id !== "status",
  },
};

export const Paginated: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = mockMachineData.slice(
      startIndex,
      startIndex + itemsPerPage,
    );

    const handlePageSizeChange = (size: number) => {
      setItemsPerPage(size);
      setCurrentPage(1);
    };

    return (
      <GenericTable
        {...args}
        data={paginatedData}
        pagination={{
          currentPage,
          setCurrentPage,
          itemsPerPage,
          totalItems: mockMachineData.length,
          handlePageSizeChange,
          dataContext: "machines",
          isPending: false,
          pageSizes: [5, 10, 20],
        }}
      />
    );
  },
};

export const Searchable: Story = {
  render: (args) => {
    const [search, setSearch] = useState("");

    const filteredData = mockMachineData.filter(
      (item) =>
        item.fqdn.toLowerCase().includes(search.toLowerCase()) ||
        item.zone.toLowerCase().includes(search.toLowerCase()) ||
        item.pool.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <div style={{ width: "100%" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem", width: "100%" }}
          />
        </div>
        <GenericTable
          {...args}
          data={filteredData}
          noData="No matching machines found"
        />
      </div>
    );
  },
};

export const Scrollable: Story = {
  render: (args) => {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
      <div style={{ width: "100%", height: "480px" }} ref={containerRef}>
        <GenericTable {...args} containerRef={containerRef} />
      </div>
    );
  },
  args: {
    data: generateMachinesData(50),
    variant: "full-height",
  },
};
