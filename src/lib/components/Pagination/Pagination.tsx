import { ChangeEvent, useEffect, useRef, useState } from "react";

import "./Pagination.scss";
import { Button, Icon, Input } from "@canonical/react-components";

export interface PaginationProps {
  currentPage: number | undefined;
  error?: string;
  isLoading: boolean;
  onInputBlur: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNextClick: () => void;
  onPreviousClick: () => void;
  pageNumber: number | undefined;
  totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  error,
  isLoading,
  onInputBlur,
  onInputChange,
  onNextClick,
  onPreviousClick,
  pageNumber,
  totalPages,
}: PaginationProps) => {
  return (
    <nav aria-label="pagination" className="p-pagination">
      <span className="p-pagination--items">
        <Button
          aria-label="Previous page"
          className="p-pagination__link--previous"
          disabled={currentPage === 1 || isLoading}
          onClick={onPreviousClick}
          type="button"
        >
          <Icon name="chevron-down" />
        </Button>
        <strong>Page </strong>{" "}
        <Input
          aria-label="page number"
          className="p-pagination__input"
          disabled={isLoading}
          error={error}
          min={1}
          onBlur={onInputBlur}
          onChange={onInputChange}
          required
          type="number"
          value={pageNumber}
        />{" "}
        <strong className="u-no-wrap"> of {totalPages}</strong>
        <Button
          aria-label="Next page"
          className="p-pagination__link--next"
          disabled={currentPage === totalPages || isLoading}
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
  debounceInterval: number;
  isLoading: PaginationProps["isLoading"];
  paginate: (page: number) => void;
  totalPages: PaginationProps["totalPages"];
}

export const PaginationContainer: React.FC<PaginationContainerProps> = ({
  currentPage,
  debounceInterval,
  isLoading,
  paginate,
  totalPages,
}: PaginationContainerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pageNumber, setPageNumber] = useState<number | undefined>(currentPage);
  const [error, setError] = useState("");

  const onInputBlur = () => {
    setPageNumber(currentPage);
    setError("");
  };

  const onInputChange: PaginationProps["onInputChange"] = (e) => {
    if (e.target.value) {
      setPageNumber(e.target.valueAsNumber);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      intervalRef.current = setTimeout(() => {
        if (e.target.valueAsNumber > totalPages || e.target.valueAsNumber < 1) {
          setError(`"${e.target.valueAsNumber}" is not a valid page number.`);
        } else {
          setError("");
          paginate(e.target.valueAsNumber);
        }
      }, debounceInterval);
    } else {
      setPageNumber(undefined);
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

  // Clear the timeout when the component is unmounted.
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return (
    <Pagination
      currentPage={currentPage}
      error={error}
      isLoading={isLoading}
      onInputBlur={onInputBlur}
      onInputChange={onInputChange}
      onNextClick={onNextClick}
      onPreviousClick={onPreviousClick}
      pageNumber={pageNumber}
      totalPages={totalPages}
    />
  );
};
