import {
  DetailedHTMLProps,
  Dispatch,
  Fragment,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SetStateAction,
  useMemo,
} from "react";

import {
  Column,
  ColumnDef,
  ColumnSort,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  Header,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

import ColumnHeader from "@/lib/components/GenericTable/components/ColumnHeader";
import PaginationBar, {
  PaginationBarProps,
} from "@/lib/components/GenericTable/components/PaginationBar";
import { useTableExpansion } from "@/lib/components/GenericTable/hooks/useTableExpansion";
import { useTableGrouping } from "@/lib/components/GenericTable/hooks/useTableGrouping";
import { useTableKeyboardNavigation } from "@/lib/components/GenericTable/hooks/useTableKeyboardNavigation";
import { useTableScrollHeight } from "@/lib/components/GenericTable/hooks/useTableScrollHeight";
import { useTableSorting } from "@/lib/components/GenericTable/hooks/useTableSorting";
import { SelectionProps, GenericTableData } from "@/lib/components/GenericTable/types";
import { processColumnDefs } from "@/lib/components/GenericTable/utils/processColumnDefs";
import { renderDataRows } from "@/lib/components/GenericTable/utils/renderDataRows";
import { renderLoadingRows } from "@/lib/components/GenericTable/utils/renderLoadingRows";

import "./GenericTable.scss";

type GenericTableProps<T extends GenericTableData> = {
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
 * @param {"spinner" | "skeleton"} [props.loadingVariant="spinner"] - Loading display style; "spinner" shows a single spinner row, "skeleton" renders skeletonRowCount pulsing skeleton rows using meta.skeleton per column when defined, falling back to a default Placeholder block
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
export const GenericTable = <T extends GenericTableData>({
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
  sorting: externalSorting = [],
  selection,
  setSorting: setExternalSorting,
  showChevron = false,
  variant = "full-height",
  ...divProps
}: GenericTableProps<T>): ReactElement => {
  const { grouping, setGrouping, groupedData } = useTableGrouping({
    groupBy,
    initialData,
  });

  const { sortedData, sorting, setSorting } = useTableSorting({
    externalSorting,
    setExternalSorting,
    grouping,
    groupedData,
    pinGroup,
  });

  const { expanded, setExpanded } = useTableExpansion({
    grouping,
    initialData,
  });

  const { tableBodyRef, maxHeight, effectiveVariant } = useTableScrollHeight({
    containerRef,
    variant,
    length: sortedData.length,
    isLoading,
  });

  // Add chevron and selection columns if needed
  const canSelect = !!selection;
  const columns = useMemo(
    () =>
      processColumnDefs({
        canSelect,
        initialColumns,
        isLoading,
        groupBy,
        getSubRows,
        selection,
        showChevron,
      }),
    [canSelect, initialColumns, isLoading, groupBy, getSubRows],
  );

  // Configure table
  const table = useReactTable<T>({
    data: sortedData,
    columns,
    state: {
      grouping,
      expanded,
      sorting,
      rowSelection: selection?.rowSelection,
    },
    manualPagination: true,
    autoResetExpanded: false,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
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

  // Handle accessibility
  const { tableRef, handleTableFocus, handleTableKeyDown } =
    useTableKeyboardNavigation({ isLoading });

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
        ref={tableRef}
        aria-busy={isLoading}
        aria-label={tableAriaLabel}
        aria-rowcount={
          (pagination?.totalItems ?? table.getRowModel().rows.length) + 1
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
          ref={tableBodyRef}
          style={{
            overflowY: "auto",
            maxHeight,
          }}
        >
          {isLoading
            ? renderLoadingRows({
                table,
                columns,
                filterHeaders,
                loadingVariant,
                skeletonRowCount,
              })
            : renderDataRows({
                table,
                columns,
                filterCells,
                getSubRows,
                noData,
                selection,
              })}
        </tbody>
      </table>
    </div>
  );
};
