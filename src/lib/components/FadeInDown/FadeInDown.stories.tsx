import { Meta } from "@storybook/react";

import { FadeInDown } from "@/lib/components/FadeInDown";

const meta: Meta<typeof FadeInDown> = {
  title: "components/FadeInDown",
  component: FadeInDown,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;

export const Example = {
  args: {},
};
