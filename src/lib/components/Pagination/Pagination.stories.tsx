import { useState } from "react";

import { Meta } from "@storybook/react";

import { Pagination, PaginationProps } from "./Pagination";

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

const ControlledTemplate = () => {
  const totalPages = 10;
  const disabled = false;

  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState("");

  const onInputBlur = () => {
    setPageNumber(pageNumber);
    setError("");
  };

  const onInputChange: PaginationProps["onInputChange"] = (e) => {
    const { value, valueAsNumber } = e.target;
    if (value) {
      setPageNumber(valueAsNumber);
      if (valueAsNumber > totalPages || valueAsNumber < 1) {
        setError(`${valueAsNumber} is not a valid page number.`);
      } else {
        setError("");
      }
    } else {
      setError("Enter a page number.");
    }
  };

  const onPreviousClick = () => {
    setPageNumber((page) => Number(page) - 1);
  };

  const onNextClick = () => {
    setPageNumber((page) => Number(page) + 1);
  };

  return (
    <Pagination 
      currentPage={pageNumber}
      error={error}
      disabled={disabled}
      onInputBlur={onInputBlur}
      onInputChange={onInputChange}
      onNextClick={onNextClick}
      onPreviousClick={onPreviousClick}
      totalPages={totalPages}
    />
  )

}

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
    totalPages: 10,
  }, 
};

export const ControlledExample = {
  render: ControlledTemplate,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
};
