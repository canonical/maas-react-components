import type { Meta } from "@storybook/react";

import { ExternalLink } from ".";

const meta: Meta<typeof ExternalLink> = {
  title: "Elements/ExternalLink",
  component: ExternalLink,
  tags: ["autodocs"],
};
export default meta;

export const Example = {
  args: {
    children: "maas.io",
    to: "https://maas.io",
  },
};
