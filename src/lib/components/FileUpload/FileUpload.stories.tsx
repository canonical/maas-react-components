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
    onFileUpload: (files: File[]) => {
      alert(files.map((file) => file.name).join(", ") + " received");
    },
  },
};
