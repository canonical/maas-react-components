import { Meta } from "@storybook/react";

import { DynamicTable } from "@/lib/components/DynamicTable/DynamicTable";

const meta: Meta<typeof DynamicTable> = {
  title: "components/DynamicTable",
  component: DynamicTable,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;

export const Example = {
  args: {},
};
