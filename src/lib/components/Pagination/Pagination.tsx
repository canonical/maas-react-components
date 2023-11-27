import { ChangeEvent } from "react";

import "./Pagination.scss";
import { Button, Icon, Input } from "@canonical/react-components";

export interface PaginationProps {
  currentPage: number;
  error?: string;
  isLoading: boolean;
  onInputBlur: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNextClick: () => void;
  onPreviousClick: () => void;
  noItems: boolean;
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
  noItems,
  totalPages,
}: PaginationProps) => {
  return (
    <nav aria-label="pagination" className="p-pagination">
      <span className="p-pagination--items">
        <Button
          aria-label="Previous page"
          className="p-pagination__link--previous"
          disabled={currentPage === 1 || isLoading || noItems}
          onClick={onPreviousClick}
          type="button"
        >
          <Icon  name="chevron-down" />
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
          value={currentPage}
        />{" "}
        <strong className="u-no-wrap"> of {totalPages}</strong>
        <Button
          aria-label="Next page"
          className="p-pagination__link--next"
          disabled={currentPage === totalPages || isLoading || noItems}
          onClick={onNextClick}
          type="button"
        >
          <Icon name="chevron-up" />
        </Button>
      </span>
    </nav>
  );
};
