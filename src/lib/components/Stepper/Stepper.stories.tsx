import { Meta } from "@storybook/react";

import { Stepper } from "@/lib/components/Stepper/Stepper";

const meta: Meta<typeof Stepper> = {
  title: "components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
      url: "https://github.com/canonical/vanilla-framework/issues/3758",
    },
  },
};

export default meta;

export const Example = {
  args: { activeStep: 0, items: ["Step 1", "Step 2", "Step 3"] },
};
