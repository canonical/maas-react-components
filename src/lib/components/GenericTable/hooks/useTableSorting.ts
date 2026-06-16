import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import type { ColumnSort, GroupingState, SortingState } from "@tanstack/react-table";

import { GenericTableData } from "@/lib/components/GenericTable/types";

export const useTableSorting = <T extends GenericTableData>({
  externalSorting,
  setExternalSorting,
  grouping,
  groupedData,
  pinGroup,
}: {
  externalSorting: ColumnSort[] | undefined;
  setExternalSorting: Dispatch<SetStateAction<SortingState>> | undefined;
  grouping: GroupingState;
  groupedData: T[];
  pinGroup: { value: string; isTop: boolean }[] | undefined;
}): {
  sorting: SortingState;
  setSorting: (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => void;
  sortedData: T[];
} => {
  const [_sorting, _setSorting] = useState<SortingState>(externalSorting ?? []);

  const setSorting = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      _setSorting(updaterOrValue);
      if (setExternalSorting) {
        setExternalSorting(updaterOrValue);
      }
    },
    [setExternalSorting],
  );

  // Apply pin-group ordering then column sorting on top of already-grouped data
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

        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
      }

      return 0;
    });
  }, [groupedData, _sorting, pinGroup, grouping]);

  return { sorting: _sorting, setSorting, sortedData };
};
