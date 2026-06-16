import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  KeyboardEvent,
  FocusEvent,
} from "react";

export const useTableKeyboardNavigation = ({
  isLoading,
}: {
  isLoading: boolean;
}): {
  tableRef: RefObject<HTMLTableElement | null>;
  handleTableFocus: (e: FocusEvent<HTMLTableElement>) => void;
  handleTableKeyDown: (e: KeyboardEvent<HTMLTableElement>) => void;
} => {
  const tableRef = useRef<HTMLTableElement>(null);
  // Tracks the <tr> that currently owns tabIndex=0 in the roving scheme.
  const rovingRowRef = useRef<HTMLTableRowElement | null>(null);

  // Safari omits display:block table children from the tab sequence; setting
  // tabIndex=0 on interactive elements explicitly fixes this. Cells are excluded
  // by the selector, so their tabIndex=-1 values are never accidentally zeroed.
  useEffect(() => {
    const tableEl = tableRef.current;
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
    const tableEl = tableRef.current;
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
    const tableEl = tableRef.current;
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

      const tableEl = tableRef.current;
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

  return { tableRef, handleTableFocus, handleTableKeyDown };
};
