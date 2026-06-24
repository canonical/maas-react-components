import { ReactNode } from "react";

import { Icon, ICONS, Spinner } from "@canonical/react-components";
import { Column, ColumnDef, Header, Row, Table } from "@tanstack/react-table";
import classNames from "classnames";

import TableCheckbox from "@/lib/components/GenericTable/components/TableCheckbox";
import { GenericTableData } from "@/lib/components/GenericTable/types";
import { Placeholder } from "@/lib/elements/Placeholder/Placeholder";

const renderInjectedCellContent = <T extends GenericTableData>(
  header: Header<T, unknown>,
  isGroupRow: boolean,
) => {
  const columnId = header.column.id;

  if (columnId === "p-generic-table__group-chevron") {
    return isGroupRow ? <Icon name={ICONS.chevronDown} /> : null;
  }
  if (columnId === "p-generic-table__group-select") {
    return isGroupRow ? <TableCheckbox.Group aria-label="select group" /> : null;
  }
  if (columnId === "p-generic-table__select") {
    return isGroupRow ? null : <TableCheckbox aria-label="select row" />;
  }
  return null;
};

// Calls filterCells with a minimal stub row so implementations that check
// row.getIsGrouped() (or similar simple accessors) work without crashing.
const applyFilterCells = <T extends GenericTableData>(
  filterCells: (row: Row<T>, column: Column<T>) => boolean,
  column: Column<T>,
  isGroupRow: boolean,
): boolean => {
  const stubRow = { getIsGrouped: () => isGroupRow } as unknown as Row<T>;
  return filterCells(stubRow, column);
};

export const renderLoadingRows = <T extends GenericTableData>({
  table,
  columns,
  filterHeaders,
  filterCells,
  loadingVariant,
  skeletonRowCount,
  skeletonGroupCount,
}: {
  table: Table<T>;
  columns: ColumnDef<T, Partial<T>>[];
  filterHeaders: (header: Header<T, unknown>) => boolean;
  filterCells: (row: Row<T>, column: Column<T>) => boolean;
  loadingVariant?: "skeleton" | "spinner";
  skeletonRowCount: number;
  skeletonGroupCount: number;
}) => {
  const allHeaders = table.getHeaderGroups()[0]?.headers ?? [];
  const visibleHeaders = allHeaders.filter(filterHeaders);

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

  const isGrouped = allHeaders.some(
    (h) =>
      h.column.id === "p-generic-table__group-select" ||
      h.column.id === "p-generic-table__group-chevron",
  );

  const renderRow = (key: string, rowIndex: number, isGroupRow: boolean) => (
    <tr
      aria-expanded={isGroupRow ? true : undefined}
      aria-rowindex={rowIndex}
      className={classNames({
        "p-generic-table__group-row": isGroupRow,
        "p-generic-table__individual-row": !isGroupRow,
        "p-generic-table__skeleton-row": true,
      })}
      key={key}
      role="row"
    >
      {allHeaders
        .filter((header) => {
          const columnId = header.column.id;
          // Mirror renderDataRows: group-specific columns always pass for group rows
          if (
            isGroupRow &&
            (columnId === "p-generic-table__group-select" ||
              columnId === "p-generic-table__group-chevron")
          ) {
            return true;
          }
          return applyFilterCells(
            filterCells,
            header.column as Column<T>,
            isGroupRow,
          );
        })
        .map((header) => {
          const columnId = header.column.id;
          const isInjected = columnId.startsWith("p-generic-table__");
          const meta = header.column.columnDef.meta;

          const content: ReactNode = isInjected ? (
            renderInjectedCellContent(header, isGroupRow)
          ) : meta?.skeleton ? (
            meta.skeleton()
          ) : (
            <Placeholder variant="block" width="70%" height="1.5rem" />
          );

          return (
            <td
              className={classNames("p-generic-table__skeleton-cell", columnId)}
              key={`${key}-${header.id}`}
              role="gridcell"
            >
              {content}
            </td>
          );
        })}
    </tr>
  );

  if (!isGrouped) {
    return Array.from({ length: skeletonRowCount }).map((_, i) =>
      renderRow(`skel-${i}`, i + 2, false),
    );
  }

  // Grouped skeleton: skeletonGroupCount groups × skeletonRowCount rows each
  const rows = [];
  let rowIndex = 1;

  for (let g = 0; g < skeletonGroupCount; g++) {
    rows.push(renderRow(`skel-group-${g}`, ++rowIndex, true));
    for (let r = 0; r < skeletonRowCount; r++) {
      rows.push(renderRow(`skel-${g}-${r}`, ++rowIndex, false));
    }
  }

  return rows;
};
