import { Meta, StoryObj } from "@storybook/react";

import { DynamicTable } from "@/lib/components/DynamicTable";
import { TableCaption } from "@/lib/components/TableCaption/TableCaption";

const meta: Meta<typeof TableCaption> = {
  title: "components/TableCaption",
  component: TableCaption,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;

export const Example: StoryObj<typeof TableCaption> = {
  args: {
    children: (
      <>
        <TableCaption.Title>No machines available</TableCaption.Title>
        <TableCaption.Description>
          Comission new machines to see them in this list.
        </TableCaption.Description>
      </>
    ),
  },
  render: (args) => (
    <DynamicTable>
      <thead>
        <tr>
          <th>FQDN</th>
          <th>IP address</th>
          <th>Zone</th>
          <th>Owner</th>
          <th>Actions</th>
        </tr>
      </thead>
      <TableCaption {...args} />
    </DynamicTable>
  ),
};
