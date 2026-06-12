import {
  DetailedHTMLProps,
  Dispatch,
  FocusEvent,
  Fragment,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";

import { Icon, ICONS, Spinner, Tooltip } from "@canonical/react-components";
import type {
  CellContext,
  Column,
  ColumnDef,
  ColumnSort,
  ExpandedState,
  GroupingState,
  Header,
  HeaderContext,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

import ColumnHeader from "@/lib/components/GenericTable/ColumnHeader";
import PaginationBar, {
  PaginationBarProps,
} from "@/lib/components/GenericTable/PaginationBar";
import TableCheckbox from "@/lib/components/GenericTable/TableCheckbox";

import "./GenericTable.scss";

declare module "@tanstack/react-table" {
  // TData / TValue must match the upstream signature; unused in the body by design.
  // noinspection JSUnusedGlobalSymbols
  interface ColumnMeta<TData extends RowData, TValue = unknown> { // eslint-disable-line unused-imports/no-unused-vars
    /** Custom loading skeleton renderer. Overrides the default shimmer for this column. */
    skeleton?: () => ReactNode;
    /** Returns an aria-label for a data cell. Use for icon-only, stacked, or badge cells. */
    cellAriaLabel?: (row: Row<TData>) => string;
    /** Set true when the header contains an interactive element to skip the sort-button wrapper. */
    isInteractiveHeader?: boolean;
    /** aria-label for the <th> — use for non-text headers such as checkboxes. */
    headerAriaLabel?: string;
    /** Set true to hide the header cell from assistive technology. */
    headerAriaHidden?: boolean;
  }
}

type SelectionProps<T extends { id: number | string }> = {
  filterSelectable?: (row: Row<T>) => boolean;
  disabledSelectionTooltip?: string | ((row: Row<T>) => string);
  rowSelectionLabelKey?: keyof T;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

type GenericTableProps<T extends { id: number | string }> = {
  "aria-label"?: string;
  className?: string;
  columns: ColumnDef<T, Partial<T>>[];
  containerRef?: RefObject<HTMLElement | null>;
  data: T[];
  filterCells?: (row: Row<T>, column: Column<T>) => boolean;
  filterHeaders?: (header: Header<T, unknown>) => boolean;
  getSubRows?: (originalRow: T, index: number) => T[] | undefined;
  groupBy?: string[];
  isLoading: boolean;
  loadingVariant?: "spinner" | "skeleton";
  skeletonRowCount?: number;
  noData?: ReactNode;
  pagination?: PaginationBarProps;
  pinGroup?: { value: string; isTop: boolean }[];
  sorting?: ColumnSort[];
  selection?: SelectionProps<T>;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  showChevron?: boolean;
  variant?: "full-height" | "regular";
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * GenericTable - A flexible and feature-rich table component for React applications
 *
 * A highly customizable table component that supports sorting, grouping, selection,
 * auto-sizing, and pagination. Built on top of TanStack Table with enhanced features
 * for enterprise applications.
 *
 * @template T - The data type for table rows, must include an 'id' property
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS class for the table wrapper
 * @param {ColumnDef<T, Partial<T>>[]} props.columns - Column definitions
 * @param {RefObject<HTMLElement | null>} [props.containerRef] - Reference to container for size calculations
 * @param {T[]} props.data - Table data array
 * @param {(row: Row<T>, column: Column<T>) => boolean} [props.filterCells] - Function to filter which cells should be displayed
 * @param {(header: Header<T, unknown>) => boolean} [props.filterHeaders] - Function to filter which headers should be displayed
 * @param {(originalRow: T, index: number) => T[] | undefined} [props.getSubRows] - Function that returns the T.prop that contains nested T data
 * @param {string[]} [props.groupBy] - Column IDs to group rows by
 * @param {boolean} props.isLoading - Loading state to display placeholder content
 * @param {"spinner" | "skeleton"} [props.loadingVariant="spinner"] - Loading display style; "spinner" shows a single spinner row, "skeleton" renders skeletonRowCount shimmer rows using meta.skeleton per column when defined, falling back to a default shimmer bar
 * @param {number} [props.skeletonRowCount=10] - Number of skeleton rows to render when loadingVariant="skeleton"
 * @param {ReactNode} [props.noData] - Content to display when no data is available
 * @param {PaginationBarProps} [props.pagination] - Pagination configuration
 * @param {{ value: string; isTop: boolean }[]} [props.pinGroup] - Group pinning configuration
 * @param {ColumnSort[]} [props.sorting] - Controlled sort state; changes to this prop are synced into the table after mount
 * @param {Dispatch<SetStateAction<SortingState>>} [props.setSorting] - Sorting state setter called on user interaction
 * @param {SelectionProps} [props.selection] - Row selection configuration. See {@link SelectionProps} for all sub-options
 *   (filterSelectable, disabledSelectionTooltip, rowSelection, rowSelectionLabelKey, setRowSelection).
 * @param {boolean} [props.showChevron=false] - Show group row expansion state chevrons
 * @param {"full-height" | "regular"} [props.variant="full-height"] - Table layout variant
 *
 * @returns {ReactElement} - The rendered table component
 *
 * @example
 * <GenericTable
 *   aria-label="Products"
 *   columns={columns}
 *   data={products}
 *   isLoading={isLoading}
 *   groupBy={["category"]}
 *   selection={{
 *     rowSelection: selectedRows,
 *     setRowSelection: setSelectedRows,
 *   }}
 *   pagination={{
 *     currentPage: page,
 *     setCurrentPage: setPage,
 *     itemsPerPage: pageSize,
 *     totalItems: totalCount,
 *     handlePageSizeChange: handlePageSizeChange,
 *   }}
 * />
 */
export const GenericTable = <
  T extends { id: number | string } & Record<string, unknown>,
>({
  "aria-label": tableAriaLabel,
  className,
  columns: initialColumns,
  containerRef,
  data: initialData,
  filterCells = () => true,
  filterHeaders = () => true,
  getSubRows,
  groupBy,
  isLoading,
  loadingVariant = "spinner",
  skeletonRowCount = 10,
  noData,
  pagination,
  pinGroup,
  sorting = [],
  selection,
  setSorting,
  showChevron = false,
  variant = "full-height",
  ...divProps
}: GenericTableProps<T>): ReactElement => {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const tableElRef = useRef<HTMLTableElement>(null);
  // Tracks the <tr> that currently owns tabIndex=0 in the roving scheme.
  const rovingRowRef = useRef<HTMLTableRowElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("auto");
  const [needsScrolling, setNeedsScrolling] = useState(false);

  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);
  const [_sorting, _setSorting] = useState<SortingState>(sorting ?? []);
  const [expanded, _setExpanded] = useState<ExpandedState>(true);

  const canSelect = !!selection;

  // Remember collapsed groups to keep them collapsed on page change
  const setExpanded = (
    updater: ExpandedState | ((prev: ExpandedState) => ExpandedState),
  ) => {
    _setExpanded((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      if (next === true) return true;

      const normalized: Record<string, boolean> = { ...next };

      // Reinsert any keys that disappeared between prev and next as false
      if (prev !== true) {
        for (const key of Object.keys(prev)) {
          if (!(key in normalized)) {
            normalized[key] = false;
          }
        }
      }

      return normalized;
    });
  };

  // Replace default true expansion state with explicit groups
  useEffect(() => {
    if (!grouping.length) return;

    setExpanded((prev) => {
      const base = prev === true ? {} : { ...prev };

      const next = { ...base };

      for (const item of initialData) {
        const groupId = grouping
          .map((g) => `${g}:${item[g as keyof typeof item]}`)
          .join(">");
        if (!(groupId in next)) {
          next[groupId] = true;
        }
      }

      return next;
    });
  }, [initialData, grouping]);

  // Add chevron and selection columns if needed
  const columns = useMemo(() => {
    let processedColumns = [...initialColumns];

    // Spinner loading doesn't render real rows — skip injecting interactive columns.
    if (isLoading) {
      return processedColumns;
    }

    // Add selection columns if needed
    if (canSelect) {
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
  }, [canSelect, initialColumns, isLoading, groupBy, getSubRows]);

  // Memoize grouped data
  const groupedData = useMemo(() => {
    if (!grouping.length) return initialData;

    return [...initialData].sort((a, b) => {
      // Sort by group values
      for (const groupId of grouping) {
        const aGroupValue = a[groupId as keyof typeof a] ?? null;
        const bGroupValue = b[groupId as keyof typeof b] ?? null;

        if (aGroupValue === null) return 1;
        if (bGroupValue === null) return -1;

        if (aGroupValue < bGroupValue) return -1;
        if (aGroupValue > bGroupValue) return 1;
      }
      return 0;
    });
  }, [initialData, grouping]);

  // Sort data based on pinning and sorting preferences
  const sortedData = useMemo(() => {
    if (!groupedData.length) return [];

    return [...groupedData].sort((a, b) => {
      // Handle pinned groups
      if (pinGroup?.length && grouping.length) {
        for (const { value, isTop } of pinGroup) {
          const groupId = grouping[0];
          const aValue = a[groupId as keyof typeof a] ?? null;
          const bValue = b[groupId as keyof typeof b] ?? null;

          if (aValue === value && bValue !== value) {
            return isTop ? -1 : 1;
          }
          if (bValue === value && aValue !== value) {
            return isTop ? 1 : -1;
          }
        }
      }

      // Sort by column sorting
      for (const { id, desc } of _sorting) {
        const aValue = a[id as keyof typeof a] ?? null;
        const bValue = b[id as keyof typeof b] ?? null;

        // Handle null values
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return desc ? -1 : 1;
        if (bValue === null) return desc ? 1 : -1;

        if (aValue < bValue) {
          return desc ? 1 : -1;
        }
        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
      }

      return 0;
    });
  }, [groupedData, _sorting, pinGroup, grouping]);

  // Update table height based on available space and determine if scrolling is needed
  useLayoutEffect(() => {
    const updateHeight = () => {
      const wrapper = tableRef.current;
      if (!wrapper) return;

      // Use provided containerRef if available, fallback to main
      const container = containerRef?.current || document.querySelector("main");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const availableHeight = containerRect.bottom - wrapperRect.top;

      // Check if content height exceeds available height
      const contentHeight = wrapper.scrollHeight;
      const willNeedScrolling = contentHeight > availableHeight;

      setNeedsScrolling(willNeedScrolling);
      setMaxHeight(
        variant === "full-height" && willNeedScrolling
          ? `${availableHeight}px`
          : "auto",
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const wrapper = tableRef.current;
    if (wrapper) resizeObserver.observe(wrapper);

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      if (wrapper) resizeObserver.unobserve(wrapper);
    };
  }, [containerRef, sortedData.length, isLoading]);

  // Safari omits display:block table children from the tab sequence; setting
  // tabIndex=0 on interactive elements explicitly fixes this. Cells are excluded
  // by the selector, so their tabIndex=-1 values are never accidentally zeroed.
  useEffect(() => {
    const tableEl = tableElRef.current;
    if (!tableEl || isLoading) return;

    const selector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
    ].join(", ");

    tableEl.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      // Respect elements intentionally removed from tab order (tabIndex="-1")
      if (el.getAttribute("tabindex") !== "-1") {
        el.tabIndex = 0;
      }
    });
  }); // no deps: re-run after every render so new rows are covered

  // Roving tabIndex: ensures exactly one data row has tabIndex=0 so Tab always
  // lands on a row. Runs after every render (useLayoutEffect, no deps) to restore
  // the active row's tabIndex before paint. Nulled when loading so the ref never
  // holds a stale reference to a detached row.
  useLayoutEffect(() => {
    const tableEl = tableElRef.current;
    if (!tableEl || isLoading) {
      rovingRowRef.current = null;
      return;
    }

    const rows = Array.from(
      tableEl.querySelectorAll<HTMLTableRowElement>('tbody tr[role="row"]'),
    ).filter((r) => r.hasAttribute("tabindex")); // exclude skeleton rows (no tabindex in JSX)

    if (rows.length === 0) return;

    if (rovingRowRef.current && rows.includes(rovingRowRef.current)) {
      rovingRowRef.current.tabIndex = 0;
    } else {
      // Previous active row is gone (data change) —> activate the first row.
      rows[0].tabIndex = 0;
      rovingRowRef.current = rows[0];
    }
  }); // no deps — mirrors the Safari fix above

  // Transfers tabIndex=0 to whichever data row contains the newly focused element.
  // Fires for thead focus too, but the tbody selector makes those calls a no-op.
  const handleTableFocus = useCallback((e: FocusEvent<HTMLTableElement>) => {
    const tableEl = tableElRef.current;
    if (!tableEl) return;

    const target = e.target as HTMLElement;
    // Scoped to tbody data rows; thead focus and skeleton rows are skipped.
    const activeRow = target.closest<HTMLTableRowElement>(
      'tbody tr[role="row"][tabindex]',
    );
    if (!activeRow) return;

    if (rovingRowRef.current && rovingRowRef.current !== activeRow) {
      rovingRowRef.current.tabIndex = -1;
    }
    activeRow.tabIndex = 0;
    rovingRowRef.current = activeRow;
  }, []);

  // Determine the effective variant based on content and scrolling needs
  const effectiveVariant =
    variant === "full-height" && needsScrolling ? "full-height" : "regular";

  // Configure table
  const table = useReactTable<T>({
    data: sortedData,
    columns,
    state: {
      grouping,
      expanded,
      sorting: _sorting,
      rowSelection: selection?.rowSelection,
    },
    manualPagination: true,
    autoResetExpanded: false,
    onExpandedChange: setExpanded,
    onSortingChange: (updaterOrValue) => {
      _setSorting(updaterOrValue);
      if (setSorting) {
        setSorting(updaterOrValue);
      }
    },
    onGroupingChange: setGrouping,
    onRowSelectionChange: selection?.setRowSelection,
    manualSorting: true,
    enableSorting: true,
    enableExpanding: true,
    getSubRows: getSubRows,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    groupedColumnMode: false,
    enableRowSelection: selection?.filterSelectable ?? canSelect,
    enableMultiRowSelection: selection?.filterSelectable ?? canSelect,
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  // treegrid keyboard navigation (arrow keys only; Tab is untouched).
  // Up/Down: move between rows. Right: enter first cell / advance cell.
  // Left: retreat cell; at first cell returns to row. Up/Down from a cell
  // moves to the same column in the adjacent row. Chevron cells are excluded.
  const handleTableKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableElement>) => {
      if (
        e.key !== "ArrowUp" &&
        e.key !== "ArrowDown" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Home" &&
        e.key !== "End"
      ) {
        return;
      }

      const tableEl = tableElRef.current;
      if (!tableEl) return;

      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      // Only intercept when focus is on a navigable row or cell.
      const isOnRow = active.matches('tr[role="row"]');
      const isOnCell = active.matches('td[role="gridcell"][tabindex="-1"]');
      if (!isOnRow && !isOnCell) return;

      e.preventDefault();

      const allRows = Array.from(
        tableEl.querySelectorAll<HTMLTableRowElement>('tbody tr[role="row"]'),
      );

      const activeRow = (
        isOnRow ? active : active.closest("tr")
      ) as HTMLTableRowElement | null;
      if (!activeRow) return;

      const rowIdx = allRows.indexOf(activeRow);
      if (rowIdx === -1) return;

      // Content cells: exclude the chevron column (visual-only indicator).
      const getContentCells = (row: HTMLTableRowElement) =>
        Array.from(
          row.querySelectorAll<HTMLElement>(
            'td[role="gridcell"][tabindex="-1"]:not(.p-generic-table__group-chevron)',
          ),
        );

      const contentCells = getContentCells(activeRow);
      const colIdx = isOnCell ? contentCells.indexOf(active) : -1;

      switch (e.key) {
        case "ArrowUp": {
          if (rowIdx <= 0) break;
          const targetRow = allRows[rowIdx - 1];
          if (isOnCell && colIdx >= 0) {
            const targetCells = getContentCells(targetRow);
            if (targetCells.length > 0) {
              targetCells[Math.min(colIdx, targetCells.length - 1)].focus();
              break;
            }
          }
          targetRow.focus();
          break;
        }
        case "ArrowDown": {
          if (rowIdx >= allRows.length - 1) break;
          const targetRow = allRows[rowIdx + 1];
          if (isOnCell && colIdx >= 0) {
            const targetCells = getContentCells(targetRow);
            if (targetCells.length > 0) {
              targetCells[Math.min(colIdx, targetCells.length - 1)].focus();
              break;
            }
          }
          targetRow.focus();
          break;
        }
        case "ArrowRight":
          if (isOnRow) {
            contentCells[0]?.focus();
          } else if (colIdx < contentCells.length - 1) {
            contentCells[colIdx + 1].focus();
          }
          break;
        case "ArrowLeft":
          if (isOnRow) break;
          if (colIdx > 0) {
            contentCells[colIdx - 1].focus();
          } else {
            activeRow.focus(); // return to row
          }
          break;
        case "Home":
          if (isOnCell) {
            contentCells[0]?.focus();
          } else if (e.ctrlKey) {
            allRows[0]?.focus();
          }
          break;
        case "End":
          if (isOnCell) {
            contentCells[contentCells.length - 1]?.focus();
          } else if (e.ctrlKey) {
            allRows[allRows.length - 1]?.focus();
          }
          break;
      }
    },
    [],
  );

  // Render loading rows — spinner (default) or per-column skeleton shimmer rows
  const renderLoadingRows = () => {
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
                <div className="p-generic-table__skeleton-default" />
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  // Render data rows
  const renderDataRows = () => {
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
            "p-generic-table__nested-row":
              getSubRows !== undefined && !!parentId,
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

  return (
    <div
      className={classNames("p-generic-table", className)}
      data-testid="p-generic-table"
      {...divProps}
    >
      {pagination && (
        <PaginationBar
          currentPage={pagination.currentPage}
          dataContext={pagination.dataContext}
          handlePageSizeChange={pagination.handlePageSizeChange}
          isPending={pagination.isPending}
          itemsPerPage={pagination.itemsPerPage}
          setCurrentPage={pagination.setCurrentPage}
          totalItems={pagination.totalItems}
          pageSizes={pagination.pageSizes}
        />
      )}
      <table
        ref={tableElRef}
        aria-busy={isLoading}
        aria-label={tableAriaLabel}
        aria-rowcount={
          pagination?.totalItems ?? table.getRowModel().rows.length
        }
        className={classNames("p-generic-table__table", {
          "p-generic-table__is-full-height": effectiveVariant === "full-height",
          "p-generic-table__is-selectable": canSelect,
          "p-generic-table__is-grouped": groupBy !== undefined,
        })}
        onFocus={handleTableFocus}
        onKeyDown={handleTableKeyDown}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role="treegrid"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr aria-rowindex={1} key={headerGroup.id} role="row">
              {headerGroup.headers
                .filter(filterHeaders)
                .map((header, index) => (
                  <Fragment key={header.id}>
                    <ColumnHeader header={header} />
                    {canSelect &&
                    groupBy &&
                    ((!showChevron && index === 2) ||
                      (showChevron && index === 3)) ? (
                      <th
                        aria-hidden="true"
                        className="p-generic-table__select-alignment"
                        role="columnheader"
                      />
                    ) : null}
                  </Fragment>
                ))}
            </tr>
          ))}
        </thead>

        <tbody
          ref={tableRef}
          style={{
            overflowY: "auto",
            maxHeight,
          }}
        >
          {isLoading ? renderLoadingRows() : renderDataRows()}
        </tbody>
      </table>
    </div>
  );
};
