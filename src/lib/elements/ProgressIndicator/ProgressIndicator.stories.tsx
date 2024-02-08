import { Meta } from "@storybook/react";

import { ProgressIndicator } from "@/lib/elements/ProgressIndicator/ProgressIndicator";

const meta: Meta<typeof ProgressIndicator> = {
  title: "elements/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;

export const Example = {
  args: {
    percentComplete: 69,
  },
};
