import { Meta, StoryObj } from "@storybook/react";

import { QueryInput } from "@/lib";

const meta: Meta<typeof QueryInput> = {
  title: "Components/QueryInput",
  component: QueryInput,
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    suggestions: [
      {
        value: "owner",
        type: "filter",
      },
      {
        value: "pool",
        type: "filter",
      },
      {
        value: "suggestion",
        type: "filter",
      },
      {
        value: "tag",
        type: "filter",
      },
      {
        value: "zone",
        type: "filter",
      },
    ],
    onSelect: (value: string) => {
      console.log(value);
    },
  },
};

export default meta;

type Story = StoryObj<typeof QueryInput>;

export const Default: Story = {};
