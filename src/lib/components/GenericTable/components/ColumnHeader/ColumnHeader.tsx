import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";
import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import SortingIndicator from "@/lib/components/GenericTable/components/SortingIndicator";

import "./ColumnHeader.scss";

type TableHeaderProps<T> = {
  header: Header<T, unknown>;
};

const ColumnHeader = <T,>({ header }: TableHeaderProps<T>): ReactElement => {
  const canSort = header.column.getCanSort();
  const meta = header.column.columnDef.meta;
  const isInteractiveHeader = meta?.isInteractiveHeader;

  const renderedHeader = flexRender(header.column.columnDef.header, header.getContext());

  return (
    <th
      aria-hidden={meta?.headerAriaHidden || undefined}
      aria-label={meta?.headerAriaLabel}
      className={classNames("p-column-header", header.column.id)}
      key={header.id}
    >
      {canSort && !isInteractiveHeader ? (
        <Button
          appearance="link"
          className="p-button--column-header"
          onClick={header.column.getToggleSortingHandler()}
          type="button"
        >
          <>
            {renderedHeader}
            <SortingIndicator header={header} />
          </>
        </Button>
      ) : (
        <span className="p-container--column-header">
            {renderedHeader}
            {canSort && !isInteractiveHeader && <SortingIndicator header={header} />}
        </span>
      )}
    </th>
  );
};

export default ColumnHeader;
