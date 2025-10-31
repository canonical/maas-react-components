import {
  DetailedHTMLProps,
  Dispatch,
  Fragment,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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

type WithId = { id: number | string };

type SelectionProps<T extends WithId> = {
  canSelect: boolean | ((row: Row<T>) => boolean);
  disabledSelectionTooltip?: string | ((row: Row<T>) => string);
  rowSelectionLabelKey?: keyof T;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

type GenericTableProps<T extends WithId> = {
  className?: string;
  columns: ColumnDef<T, Partial<T>>[];
  containerRef?: RefObject<HTMLElement | null>;
  data: T[];
  filterCells?: (row: Row<T>, column: Column<T>) => boolean;
  filterHeaders?: (header: Header<T, unknown>) => boolean;
  getSubRows?: (originalRow: T, index: number) => T[] | undefined;
  groupBy?: string[];
  isLoading: boolean;
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
 * @param {boolean | ((row: Row<T>) => boolean)} [props.canSelect=false] - Enable row selection with checkboxes
 * @param {string | ((row: Row<T>) => string)} [props.disabledSelectionTooltip] - Tooltip message or constructor on disabled checkboxes
 * @param {ColumnDef<T, Partial<T>>[]} props.columns - Column definitions
 * @param {RefObject<HTMLElement | null>} [props.containerRef] - Reference to container for size calculations
 * @param {T[]} props.data - Table data array
 * @param {(row: Row<T>, column: Column<T>) => boolean} [props.filterCells] - Function to filter which cells should be displayed
 * @param {(header: Header<T, unknown>) => boolean} [props.filterHeaders] - Function to filter which headers should be displayed
 * @param {(originalRow: T, index: number) => T[] | undefined} [props.getSubRows] - Function that returns the T.prop that contains nested T data
 * @param {string[]} [props.groupBy] - Column IDs to group rows by
 * @param {boolean} props.isLoading - Loading state to display placeholder content
 * @param {ReactNode} [props.noData] - Content to display when no data is available
 * @param {PaginationBarProps} [props.pagination] - Pagination configuration
 * @param {{ value: string; isTop: boolean }[]} [props.pinGroup] - Group pinning configuration
 * @param {ColumnSort[]} [props.sorting] - Initial sort configuration
 * @param {Dispatch<SetStateAction<SortingState>>} [props.setSorting] - Sorting state setter
 * @param {RowSelectionState} [props.rowSelection] - Selected rows state
 * @param {keyof T} [props.rowSelectionLabelKey] - Key of T to use as aria-labels for row checkboxes
 * @param {Dispatch<SetStateAction<RowSelectionState>>} [props.setRowSelection] - Selection state setter
 * @param {boolean} [props.showChevron=false] - Show group row expansion state chevrons
 * @param {"full-height" | "regular"} [props.variant="full-height"] - Table layout variant
 *
 * @returns {ReactElement} - The rendered table component
 *
 * @example
 * <GenericTable
 *   columns={columns}
 *   data={products}
 *   isLoading={isLoading}
 *   canSelect={true}
 *   groupBy={["category"]}
 *   rowSelection={selectedRows}
 *   setRowSelection={setSelectedRows}
 *   pagination={{
 *     currentPage: page,
 *     setCurrentPage: setPage,
 *     itemsPerPage: pageSize,
 *     totalItems: totalCount,
 *     handlePageSizeChange: handlePageSizeChange
 *   }}
 * />
 */
export const GenericTable = <
  T extends { id: number | string } & Record<string, unknown>,
>({
  className,
  columns: initialColumns,
  containerRef,
  data: initialData,
  filterCells = () => true,
  filterHeaders = () => true,
  getSubRows,
  groupBy,
  isLoading,
  noData,
  pagination,
  pinGroup,
  sorting = [],
  selection,
  setSorting,
  showChevron = false,
  variant = "full-height",
  ...props
}: GenericTableProps<T>): ReactElement => {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [maxHeight, setMaxHeight] = useState("auto");
  const [needsScrolling, setNeedsScrolling] = useState(false);

  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);
  const [_sorting, _setSorting] = useState<SortingState>(sorting ?? []);
  const [expanded, _setExpanded] = useState<ExpandedState>(true);

  const canSelect = selection?.canSelect || false;

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

    if (isLoading) {
      return processedColumns;
    }

    // Add selection columns if needed
    if (selection && canSelect) {
      const selectionColumns = [
        {
          id: "p-generic-table__select",
          accessorKey: "id",
          enableSorting: false,
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
  }, [containerRef, sortedData.length, isLoading]); // Added dependencies to recalculate when data changes

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
    enableRowSelection: canSelect,
    enableMultiRowSelection: canSelect,
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  // Render loading placeholder rows
  const renderLoadingRows = () => {
    return (
      <tr>
        <td className="p-generic-table__loading" colSpan={columns.length}>
          <Spinner text="Loading..." />
        </td>
      </tr>
    );
  };

  // Render data rows
  const renderDataRows = () => {
    if (table.getRowModel().rows.length < 1) {
      return (
        <tr>
          <td className="p-generic-table__no-data" colSpan={columns.length}>
            {noData}
          </td>
        </tr>
      );
    }

    return table.getRowModel().rows.map((row) => {
      const { getIsGrouped, id, getVisibleCells, parentId } = row;
      const isIndividualRow = !getIsGrouped();
      const isSelected =
        selection?.rowSelection !== undefined &&
        Object.keys(selection.rowSelection!).includes(id);

      return (
        <tr
          aria-rowindex={parseInt(id.replace(/\D/g, "") || "0", 10) + 1}
          aria-selected={isSelected}
          className={classNames({
            "p-generic-table__individual-row": isIndividualRow,
            "p-generic-table__group-row": !isIndividualRow,
            "p-generic-table__nested-row":
              getSubRows !== undefined && !!parentId,
          })}
          onClick={() => {
            if (isIndividualRow) return;
            row.toggleExpanded();
          }}
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
              <td className={classNames(`${cell.column.id}`)} key={cell.id}>
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
      {...props}
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
        aria-busy={isLoading}
        aria-label={props["aria-label"]}
        aria-describedby="generic-table-description"
        aria-rowcount={sortedData.length + 1} // +1 for header row
        className={classNames("p-generic-table__table", {
          "p-generic-table__is-full-height": effectiveVariant === "full-height",
          "p-generic-table__is-selectable": canSelect,
          "p-generic-table__is-grouped": groupBy !== undefined,
        })}
        role="grid"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} role="row">
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
