import { Meta } from "@storybook/react";

import { FileUpload } from "@/lib/components/FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;

export const Example = {
  args: {
    error: "",
    help: "Max file size is 2MB.",
    label: "Upload files",
    maxFiles: 7,
    maxSize: 2000000,
  },
};
