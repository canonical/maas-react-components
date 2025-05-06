import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";
import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import SortingIndicator from "@/lib/components/GenericTable/SortingIndicator";

import "./ColumnHeader.scss";

type TableHeaderProps<T> = {
  header: Header<T, unknown>;
};

const ColumnHeader = <T,>({ header }: TableHeaderProps<T>): ReactElement => {
  return (
    <th className={classNames(`${header.column.id}`)} key={header.id}>
      {header.column.getCanSort() ? (
        <Button
          appearance="link"
          className="table-header-label p-button--table-header"
          onClick={header.column.getToggleSortingHandler()}
          type="button"
        >
          <>
            {flexRender(header.column.columnDef.header, header.getContext())}
            <SortingIndicator header={header} />
          </>
        </Button>
      ) : (
        flexRender(header.column.columnDef.header, header.getContext())
      )}
    </th>
  );
};

export default ColumnHeader;
