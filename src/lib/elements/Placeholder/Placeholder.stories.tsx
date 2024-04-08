import { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/lib/elements/Placeholder/Placeholder";

const meta: Meta<typeof Placeholder> = {
  title: "elements/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;

export const TextExample: StoryObj<typeof Placeholder> = {
  args: {
    isPending: true,
    text: "XXXxxxx.xxxxxxxxx",
  },
};

export const ComponentExample: StoryObj<typeof Placeholder> = {
  args: {
    isPending: true,
    children: <span>XXXxxxx.xxxxxxxxx</span>,
  },
};
