import { Meta } from "@storybook/react";

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

export const TextExample = {
  args: {
    isPending: true,
    style: { opacity: 0.9 },
    text: "XXXxxxx.xxxxxxxxx",
  },
};

export const ComponentExample = {
  args: {
    isPending: true,
    style: { opacity: 0.9 },
    children: <span>XXXxxxx.xxxxxxxxx</span>,
  },
};
