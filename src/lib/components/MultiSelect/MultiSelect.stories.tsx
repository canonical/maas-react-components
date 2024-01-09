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
    items: Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`),
    selectedItems: ["Item 1", "Item 2"],
    disabledItems: ["Item 1", "Item 3"],
  },
};
