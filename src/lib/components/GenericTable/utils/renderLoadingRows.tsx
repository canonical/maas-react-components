import { Spinner } from "@canonical/react-components";
import { ColumnDef, Header, Table } from "@tanstack/react-table";
import classNames from "classnames";

import { GenericTableData } from "@/lib/components/GenericTable/types";
import { Placeholder } from "@/lib/elements/Placeholder/Placeholder";

export const renderLoadingRows = <T extends GenericTableData>({
  table,
  columns,
  filterHeaders,
  loadingVariant,
  skeletonRowCount,
}: {
  table: Table<T>;
  columns: ColumnDef<T, Partial<T>>[];
  filterHeaders: (header: Header<T, unknown>) => boolean;
  loadingVariant?: "skeleton" | "spinner";
  skeletonRowCount: number;
}) => {
  const visibleHeaders =
    table.getHeaderGroups()[0]?.headers.filter(filterHeaders) ?? [];

  if (loadingVariant !== "skeleton") {
    return (
      <tr>
        <td
          className="p-generic-table__loading"
          colSpan={visibleHeaders.length || columns.length}
          role="gridcell"
        >
          <Spinner text="Loading..." />
        </td>
      </tr>
    );
  }

  return Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
    <tr
      aria-rowindex={rowIndex + 2}
      className="p-generic-table__skeleton-row"
      key={`skel-${rowIndex}`}
      role="row"
    >
      {visibleHeaders.map((header) => {
        const meta = header.column.columnDef.meta;
        const isInjectedColumn =
          header.column.id.startsWith("p-generic-table__");
        return (
          <td
            className={classNames(
              "p-generic-table__skeleton-cell",
              header.column.id,
            )}
            key={`skel-${rowIndex}-${header.id}`}
            role="gridcell"
          >
            {isInjectedColumn ? null : meta?.skeleton ? (
              meta.skeleton()
            ) : (
              <Placeholder variant="block" width="70%" height="1.5rem" />
            )}
          </td>
        );
      })}
    </tr>
  ));
};
