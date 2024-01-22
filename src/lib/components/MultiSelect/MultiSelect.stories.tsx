import { useState } from "react";

import { Meta } from "@storybook/react";

import {
  MultiSelect,
  MultiSelectItem,
  MultiSelectProps,
} from "@/lib/components/MultiSelect/MultiSelect";

const Template = (props: MultiSelectProps) => {
  const [selectedItems, setSelectedItems] = useState<MultiSelectItem[]>(
    props.selectedItems || [],
  );
  return (
    <MultiSelect
      {...props}
      selectedItems={selectedItems}
      onItemsUpdate={setSelectedItems}
    />
  );
};

const meta: Meta<typeof MultiSelect> = {
  title: "components/MultiSelect",
  component: MultiSelect,
  render: Template,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;

export const Example = {
  args: {
    items: Array.from({ length: 10 }, (_, i) => ({ label: `Item ${i + 1}`, value: i + 1 })),
    selectedItems: [{ label: "Item 1", value: 1 }, { label: "Item 2", value: 2 }],
    disabledItems: [{ label: "Item 1", value: 1 }, { label: "Item 3", value: 3 }],
  },
};
