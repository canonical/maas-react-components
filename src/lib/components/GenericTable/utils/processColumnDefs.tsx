import { Icon, ICONS, Tooltip } from "@canonical/react-components";
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
  Row,
} from "@tanstack/react-table";

import TableCheckbox from "@/lib/components/GenericTable/components/TableCheckbox";
import { SelectionProps, GenericTableData } from "@/lib/components/GenericTable/types";

export const processColumnDefs = <T extends GenericTableData>({
  canSelect,
  initialColumns,
  isLoading,
  groupBy,
  getSubRows,
  selection,
  showChevron,
}: {
  canSelect: boolean;
  initialColumns: ColumnDef<T, Partial<T>>[];
  isLoading: boolean;
  groupBy: string[] | undefined;
  getSubRows?: (originalRow: T, index: number) => T[] | undefined;
  selection?: SelectionProps<T>;
  showChevron: boolean;
}): ColumnDef<T, Partial<T>>[] => {
  let processedColumns = [...initialColumns];

  // Spinner loading doesn't render real rows — skip injecting interactive columns.
  if (isLoading) {
    return processedColumns;
  }

  // Add selection columns if needed
  if (canSelect && selection) {
    const selectionColumns = [
      {
        id: "p-generic-table__select",
        accessorKey: "id",
        enableSorting: false,
        meta: { headerAriaLabel: "Row selection" },
        header: ({ table }: HeaderContext<T, Partial<T>>) => {
          if (groupBy) {
            return "";
          }
          return <TableCheckbox.All table={table} />;
        },
        cell: ({ row }: CellContext<T, Partial<T>>) => {
          const ariaLabel =
            selection.rowSelectionLabelKey &&
            selection.rowSelectionLabelKey in row.original
              ? `select ${row.original[selection.rowSelectionLabelKey]}`
              : "select row";
          return !row.getIsGrouped() ? (
            <TableCheckbox
              aria-label={ariaLabel}
              disabledTooltip={selection.disabledSelectionTooltip ?? ""}
              isNested={getSubRows !== undefined && !!row.parentId}
              row={row}
            />
          ) : null;
        },
      },
      ...processedColumns,
    ];

    if (groupBy) {
      const getAriaLabel = (row: Row<T>) =>
        groupBy[0] in row.original
          ? `select ${row.original[groupBy[0]]}`
          : "select group";
      processedColumns = [
        {
          id: "p-generic-table__group-select",
          accessorKey: "id",
          enableSorting: false,
          meta: { headerAriaLabel: "Row selection" },
          header: ({ table }: HeaderContext<T, Partial<T>>) => (
            <TableCheckbox.All table={table} />
          ),
          cell: ({ row }: CellContext<T, Partial<T>>) =>
            row.getIsGrouped() ? (
              <TableCheckbox.Group aria-label={getAriaLabel(row)} row={row} />
            ) : null,
        },
        ...selectionColumns,
      ];
    } else {
      processedColumns = selectionColumns;
    }
  }

  // Add chevron column if grouping is enabled
  if (groupBy && showChevron) {
    const chevronColumn = {
      id: "p-generic-table__group-chevron",
      accessorKey: "id",
      enableSorting: false,
      meta: { headerAriaHidden: true },
      header: "",
      cell: ({ row }: CellContext<T, Partial<T>>) => {
        const isExpanded = row.getIsExpanded();
        if (row.getIsGrouped()) {
          return (
            <Tooltip
              message={isExpanded ? "Collapse" : "Expand"}
              position="btm-right"
            >
              <Icon name={isExpanded ? ICONS.chevronUp : ICONS.chevronDown} />
            </Tooltip>
          );
        }
        return null;
      },
    };

    processedColumns = [chevronColumn, ...processedColumns];
  }

  return processedColumns;
};
