import type { Meta, StoryObj } from "@storybook/react";

import { LimitedInput } from "@/lib/elements/LimitedInput/LimitedInput";

const meta: Meta<typeof LimitedInput> = {
  title: "elements/LimitedInput",
  component: LimitedInput,
  tags: ["autodocs"],
};

export default meta;

export const Example: StoryObj<typeof LimitedInput> = {
  args: {
    help: "The valid range for this subnet is 192.168.0.[1-254]",
    label: "IP address",
    immutableText: "192.168.0.",
    placeholder: "[1-254]",
  },
};
