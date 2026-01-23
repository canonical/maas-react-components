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
    accept: {
      "application/octet-stream": [
        ".tgz",
        ".tbz",
        ".txz",
        ".ddtgz",
        ".ddtbz",
        ".ddtxz",
        ".ddtar",
        ".ddbz2",
        ".ddgz",
        ".ddxz",
        ".ddraw",
      ],
    },
    error: "",
    help: "Max file size is 2MB.",
    label: "Upload files",
    maxFiles: 2,
    maxSize: 2000000,
    minSize: 1000,
  },
};
