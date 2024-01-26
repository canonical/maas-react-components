import { Meta } from "@storybook/react";

import { formatBytes } from "@/lib/utils";
import { getUtilStoryComponent } from "@/utils";

const meta: Meta<typeof formatBytes> = {
  title: "utils/formatBytes",
  component: getUtilStoryComponent(formatBytes),
  parameters: {
    status: {
      type: "legacy",
    },
  },
};

export default meta;
export const Example = {
  args: { value: 1234, unit: "B" },
};
