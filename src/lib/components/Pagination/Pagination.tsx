import { ChangeEvent, useState } from "react";

import "./Pagination.scss";
import { Button, Icon, Input } from "@canonical/react-components";

export interface PaginationProps {
  currentPage: number | undefined;
  error?: string;
  disabled: boolean;
  onInputBlur: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNextClick: () => void;
  onPreviousClick: () => void;
  totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  error,
  disabled,
  onInputBlur,
  onInputChange,
  onNextClick,
  onPreviousClick,
  totalPages,
}: PaginationProps) => {
  return (
    <nav aria-label="pagination" className="p-pagination">
      <span className="p-pagination--items">
        <Button
          aria-label="Previous page"
          className="p-pagination__link--previous"
          disabled={currentPage === 1 || disabled}
          onClick={onPreviousClick}
          type="button"
        >
          <Icon name="chevron-down" />
        </Button>
        <strong>Page </strong>{" "}
        <Input
          aria-label="page number"
          className="p-pagination__input"
          disabled={disabled}
          error={error}
          min={1}
          onBlur={onInputBlur}
          onChange={onInputChange}
          required
          type="number"
          value={currentPage}
        />{" "}
        <strong className="u-no-wrap"> of {totalPages}</strong>
        <Button
          aria-label="Next page"
          className="p-pagination__link--next"
          disabled={currentPage === totalPages || disabled}
          onClick={onNextClick}
          type="button"
        >
          <Icon name="chevron-up" />
        </Button>
      </span>
    </nav>
  );
};

export interface PaginationContainerProps {
  currentPage: PaginationProps["currentPage"];
  disabled: PaginationProps["disabled"];
  paginate: (page: number) => void;
  totalPages: PaginationProps["totalPages"];
}

export const PaginationContainer: React.FC<PaginationContainerProps> = ({
  currentPage,
  disabled,
  paginate,
  totalPages,
}: PaginationContainerProps) => {
  const [pageNumber, setPageNumber] = useState<number | undefined>(currentPage);
  const [error, setError] = useState("");

  const onInputBlur = () => {
    setPageNumber(currentPage);
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
        paginate(valueAsNumber);
      }
    } else {
      setError("Enter a page number.");
    }
  };

  const onPreviousClick = () => {
    setPageNumber((page) => Number(page) - 1);
    paginate(Number(currentPage) - 1);
  };

  const onNextClick = () => {
    setPageNumber((page) => Number(page) + 1);
    paginate(Number(currentPage) + 1);
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
  );
};
