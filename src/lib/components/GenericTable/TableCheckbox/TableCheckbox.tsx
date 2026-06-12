import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
} from "react";
import { useEffect, useRef } from "react";

import { Tooltip } from "@canonical/react-components";
import type { Row, Table } from "@tanstack/react-table";

type TableCheckboxProps<T> = Partial<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> & {
  row?: Row<T>;
  table?: Table<T>;
};

const TableAllCheckbox = <T,>({ table, ...props }: TableCheckboxProps<T>) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  if (!table) {
    return null;
  }

  const selectableRows = table
    .getCoreRowModel()
    .rows.filter((row) => row.getCanSelect());

  const selectedSelectableRows = table
    .getSelectedRowModel()
    .rows.filter((row) => row.getCanSelect());

  const isAllSelected =
    selectableRows.length > 0 &&
    selectedSelectableRows.length === selectableRows.length;
  const isIndeterminate = selectedSelectableRows.length > 0 && !isAllSelected;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      className="p-checkbox--inline p-table-checkbox--all"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <input
        ref={checkboxRef}
        aria-label="select all"
        className="p-checkbox__input"
        disabled={selectableRows.length === 0}
        type="checkbox"
        checked={isAllSelected}
        onChange={() => {
          const rows = table
            .getCoreRowModel()
            .rows.filter((row) => row.getCanSelect());

          const allSelected = rows.every((row) => row.getIsSelected());
          rows.forEach((row) => row.toggleSelected(!allSelected));
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

const TableGroupCheckbox = <T,>({ row, ...props }: TableCheckboxProps<T>) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  if (!row) {
    return null;
  }
  const selectableSubRows = row.subRows.filter((subRow) =>
    subRow.getCanSelect(),
  );
  const selectedCount = selectableSubRows.filter((subRow) =>
    subRow.getIsSelected(),
  ).length;
  const isAllSelectableSelected =
    selectableSubRows.length > 0 && selectedCount === selectableSubRows.length;
  const isSomeSelectableSelected =
    selectedCount > 0 && !isAllSelectableSelected;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSomeSelectableSelected;
    }
  }, [isSomeSelectableSelected]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      className="p-checkbox--inline p-table-checkbox--group"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <input
        ref={checkboxRef}
        className="p-checkbox__input"
        type="checkbox"
        checked={isAllSelectableSelected}
        disabled={!row.getCanSelect() && selectableSubRows.length === 0}
        onChange={() => {
          const newSelected = !isAllSelectableSelected;
          selectableSubRows.forEach((subRow) =>
            subRow.toggleSelected(newSelected),
          );
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

const TableCheckbox = <T,>({
  row,
  disabledTooltip,
  isNested = false,
  ...props
}: TableCheckboxProps<T> & {
  disabledTooltip: string | ((row: Row<T>) => string);
  isNested: boolean;
}): ReactElement | null => {
  if (!row) {
    return null;
  }

  const canSelect = row.getCanSelect();

  const disabledTooltipMessage =
    typeof disabledTooltip === "string"
      ? disabledTooltip
      : disabledTooltip(row);

  // Explain why the checkbox is disabled regardless of cause
  const tooltipMessage = isNested
    ? "Selection is managed by the parent row"
    : !canSelect
      ? disabledTooltipMessage
      : false;

  return (
    <Tooltip message={tooltipMessage} position="btm-right">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <label
        className="p-checkbox--inline p-table-checkbox"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          className="p-checkbox__input"
          type="checkbox"
          {...{
            checked: row.getIsSelected(),
            disabled: !canSelect || isNested,
            onChange: row.getToggleSelectedHandler(),
          }}
          {...props}
        />
        <span className="p-checkbox__label" />
      </label>
    </Tooltip>
  );
};

TableCheckbox.All = TableAllCheckbox;
TableCheckbox.Group = TableGroupCheckbox;

export default TableCheckbox;
