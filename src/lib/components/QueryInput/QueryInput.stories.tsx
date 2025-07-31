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
        value: "status",
        type: "filter",
      },
      {
        value: "deployment_target",
        type: "filter",
      },
      {
        value: "owner",
        type: "filter",
      },
      {
        value: "pool",
        type: "filter",
      },
      {
        value: "architecture",
        type: "filter",
      },
      {
        value: "tag",
        type: "filter",
      },
      {
        value: "workload",
        type: "filter",
      },
      {
        value: "kvm",
        type: "filter",
      },
      {
        value: "subnet",
        type: "filter",
      },
      {
        value: "fabric",
        type: "filter",
      },
      {
        value: "zone",
        type: "filter",
      },
      {
        value: "vlan",
        type: "filter",
      },
      {
        value: "space",
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
