import { Dispatch, ReactNode, SetStateAction } from "react";

import  { Row, RowData, RowSelectionState, VisibilityState } from "@tanstack/react-table";

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

/** Base constraint for all GenericTable row data: must have an `id` and be string-indexable. */
export type GenericTableData = { id: number | string } & Record<string, unknown>;

export type SelectionProps<T extends GenericTableData> = {
  filterSelectable?: (row: Row<T>) => boolean;
  disabledSelectionTooltip?: string | ((row: Row<T>) => string);
  rowSelectionLabelKey?: keyof T;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

export type ColumnVisibilityProps = {
  columnVisibility: VisibilityState;
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
};
