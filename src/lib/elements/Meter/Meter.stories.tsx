import type { Meta } from "@storybook/react";

import { Meter, meterColor } from ".";

const meta: Meta<typeof Meter> = {
  title: "Elements/Meter",
  component: Meter,
  tags: ["autodocs"],
  args: {
    variant: "regular",
    size: "regular",
  },
};
export default meta;

const data = [
  { value: 200, color: meterColor.link },
  { value: 30.8, color: meterColor.linkFaded },
  { value: 400, color: "black" },
];

export const Regular = {
  args: {
    data,
  },
};

export const Segmented = {
  args: {
    data,
    variant: "segmented",
  },
};

export const WithLabel = {
  args: {
    data,
    children: <Meter.Label>Label</Meter.Label>,
  },
};

export const NoItems = {
  args: {
    data: [],
  },
};
