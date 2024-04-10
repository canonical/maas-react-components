import { Meta, StoryObj } from "@storybook/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DynamicTable } from "@/lib/components/DynamicTable/DynamicTable";

type Device = {
  fqdn: string;
  ipAddress: string;
  zone: string;
  owner: string;
};

type DeviceColumnDef = ColumnDef<Device, Device[keyof Device]>;

const columns: DeviceColumnDef[] = [
  {
    id: "fqdn",
    accessorKey: "fqdn",
    header: () => <div>FQDN</div>,
  },
  {
    id: "ipAddress",
    accessorKey: "ipAddress",
    header: () => <div>IP address</div>,
  },
  {
    id: "zone",
    accessorKey: "zone",
    header: () => <div>Zone</div>,
  },
  {
    id: "owner",
    accessorKey: "owner",
    header: () => <div>Owner</div>,
  },
];

const data = Array.from({ length: 50 }, (_, index) => ({
  fqdn: `machine-${index}`,
  ipAddress: `192.168.1.${index}`,
  zone: `zone-${index}`,
  owner: `owner-${index}`,
}));

const TableChildren = () => {
  const table = useReactTable<Device>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  className={`${header.column.id}`}
                  colSpan={header.colSpan}
                  key={header.id}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <DynamicTable.Body>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className={`${cell.column.id}`} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </DynamicTable.Body>
    </>
  );
};

const meta: Meta<typeof DynamicTable> = {
  title: "components/DynamicTable",
  component: DynamicTable,
  tags: ["autodocs"],
  render: () => (
    <DynamicTable>
      <TableChildren />
    </DynamicTable>
  ),
};

export default meta;

export const Example: StoryObj<typeof DynamicTable> = {
  args: {
    className: "machines-table",
  },
};
