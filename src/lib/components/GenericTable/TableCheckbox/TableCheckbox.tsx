import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
} from "react";

import type { Row, Table } from "@tanstack/react-table";

type TableCheckboxProps<T> = Partial<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> & {
  row?: Row<T>;
  table?: Table<T>;
};

const TableAllCheckbox = <T,>({ table, ...props }: TableCheckboxProps<T>) => {
  if (!table) {
    return null;
  }

  const selectableRows = table
    .getCoreRowModel()
    .rows.filter((row) => row.getCanSelect());

  let checked: boolean | "false" | "mixed" | "true" | undefined;
  if (table.getSelectedRowModel().rows.length === 0) {
    checked = "false";
  } else if (table.getSelectedRowModel().rows.length < selectableRows.length) {
    checked = "mixed";
  } else {
    checked = "true";
  }

  return (
    <label className="p-checkbox--inline p-table-checkbox--all">
      <input
        aria-checked={checked}
        aria-label="select all"
        className="p-checkbox__input"
        disabled={selectableRows.length === 0}
        type="checkbox"
        {...{
          checked: checked === "true",
          onChange: () => {
            const selectableRows = table
              .getCoreRowModel()
              .rows.filter((row) => row.getCanSelect());

            const allSelected = selectableRows.every((row) =>
              row.getIsSelected(),
            );

            selectableRows.forEach((row) => row.toggleSelected(!allSelected));
          },
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

const TableGroupCheckbox = <T,>({ row, ...props }: TableCheckboxProps<T>) => {
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

  return (
    <label
      aria-disabled={!row.getCanSelect()}
      className="p-checkbox--inline p-table-checkbox--group"
    >
      <input
        aria-checked={isSomeSelectableSelected ? "mixed" : undefined}
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
  ...props
}: TableCheckboxProps<T>): ReactElement | null => {
  if (!row) {
    return null;
  }
  return (
    <label
      aria-disabled={!row.getCanSelect()}
      className="p-checkbox--inline p-table-checkbox"
    >
      <input
        className="p-checkbox__input"
        type="checkbox"
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onChange: row.getToggleSelectedHandler(),
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

TableCheckbox.All = TableAllCheckbox;
TableCheckbox.Group = TableGroupCheckbox;

export default TableCheckbox;
