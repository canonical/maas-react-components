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
    help: "Max file size is 2GB.",
    label: "Upload files",
    maxFiles: 7,
    maxSize: 2000000000,
  },
};

export const UploadingExample = {
  args: {
    error: "",
    help: "Max file size is 2GB.",
    label: "Upload files",
    maxFiles: 3,
    maxSize: 20000000000,
    uploadingFiles: [
      {
        name: "notes.txt",
        percentComplete: 100,
      },
      {
        name: "content.mp4",
        percentComplete: 69,
      },
      {
        name: "meme.png",
        percentComplete: 0,
      },
    ],
  },
};
