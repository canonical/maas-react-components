import type { Meta } from "@storybook/react";

import { Meter, meterColor } from ".";

const meta: Meta<typeof Meter> = {
  title: "Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "legacy",
    },
  },
};
export default meta;

export const Example = {
  args: {
    data: [
      { value: 200, color: meterColor.link },
      { value: 30.8, color: meterColor.linkFaded },
      { value: 400, color: "black" },
    ],
  },
};

export const NoItems = {
  args: {
    data: [],
  },
};
