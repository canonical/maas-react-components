import { KeyboardEvent, ReactNode } from "react";

import {
  Column,
  ColumnDef,
  flexRender,
  Row,
  Table,
} from "@tanstack/react-table";
import classNames from "classnames";

import { SelectionProps, GenericTableData } from "@/lib/components/GenericTable/types";

export const renderDataRows = <T extends GenericTableData>({
  table,
  columns,
  filterCells,
  getSubRows,
  noData,
  selection,
}: {
  table: Table<T>;
  columns: ColumnDef<T, Partial<T>>[];
  filterCells: (row: Row<T>, column: Column<T>) => boolean;
  getSubRows?: (originalRow: T, index: number) => T[] | undefined;
  noData: ReactNode;
  selection?: SelectionProps<T>;
}) => {
  if (table.getRowModel().rows.length < 1) {
    return (
      <tr>
        <td
          className="p-generic-table__no-data"
          colSpan={columns.length}
          role="gridcell"
        >
          <div aria-live="polite" role="status">
            {noData}
          </div>
        </td>
      </tr>
    );
  }

  // Sequential 1-based index; header row occupies index 1
  let rowIndex = 1;

  return table.getRowModel().rows.map((row) => {
    rowIndex++;
    const currentRowIndex = rowIndex;
    const { getIsGrouped, id, getVisibleCells, parentId } = row;
    const isIndividualRow = !getIsGrouped();
    const isSelected =
      selection?.rowSelection !== undefined &&
      Object.keys(selection.rowSelection!).includes(id);

    const handleGroupKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        row.toggleExpanded();
      }
    };

    // Enter / Space focuses the first interactive element inside the row.
    const handleIndividualRowKeyDown = (
      e: KeyboardEvent<HTMLTableRowElement>,
    ) => {
      if (e.target !== e.currentTarget) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const firstInteractive = e.currentTarget.querySelector<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled])",
      );
      firstInteractive?.focus();
    };

    return (
      <tr
        aria-expanded={!isIndividualRow ? row.getIsExpanded() : undefined}
        aria-rowindex={currentRowIndex}
        aria-selected={isSelected}
        className={classNames({
          "p-generic-table__individual-row": isIndividualRow,
          "p-generic-table__group-row": !isIndividualRow,
          "p-generic-table__nested-row": getSubRows !== undefined && !!parentId,
        })}
        onClick={!isIndividualRow ? () => row.toggleExpanded() : undefined}
        onKeyDown={
          isIndividualRow ? handleIndividualRowKeyDown : handleGroupKeyDown
        }
        tabIndex={-1}
        key={id}
        role="row"
      >
        {getVisibleCells()
          .filter((cell) => {
            if (
              !isIndividualRow &&
              (cell.column.id === "p-generic-table__group-select" ||
                cell.column.id === "p-generic-table__group-chevron")
            )
              return true;
            return filterCells(row, cell.column);
          })
          .map((cell) => (
            <td
              aria-hidden={
                cell.column.id === "p-generic-table__select" &&
                getSubRows !== undefined &&
                !!parentId
                  ? true
                  : undefined
              }
              aria-label={
                cell.column.columnDef.meta?.cellAriaLabel?.(row) ?? undefined
              }
              className={classNames(`${cell.column.id}`)}
              key={cell.id}
              role="gridcell"
              tabIndex={-1}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
      </tr>
    );
  });
};
