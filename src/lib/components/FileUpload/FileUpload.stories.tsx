import { Meta } from "@storybook/react";

import { FileUploadContainer } from "@/lib/components/FileUpload";

const meta: Meta<typeof FileUploadContainer> = {
  title: "components/FileUpload",
  component: FileUploadContainer,
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
