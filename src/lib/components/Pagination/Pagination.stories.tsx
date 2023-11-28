import { Meta } from "@storybook/react";

import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  render: (args) => (
    <Pagination {...args} />
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;
export const Example = { 
  args: {
    currentPage: 1,
    error: "",
    disabled: false,
    onInputBlur: () => {},
    onInputChange: () => {},
    onNextClick: () => {},
    onPreviousClick: () => {},
    pageNumber: 1,
    totalPages: 10,
  }, 
};
