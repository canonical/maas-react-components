import { Dispatch, SetStateAction, useMemo, useState } from "react";

import type { GroupingState } from "@tanstack/react-table";

import { GenericTableData } from "@/lib/components/GenericTable/types";

export const useTableGrouping = <T extends GenericTableData>({
  groupBy,
  initialData,
}: {
  groupBy: string[] | undefined;
  initialData: T[];
}): {
  grouping: GroupingState;
  setGrouping: Dispatch<SetStateAction<GroupingState>>;
  groupedData: T[];
} => {
  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);

  // Sort data so rows belonging to the same group are contiguous
  const groupedData = useMemo(() => {
    if (!grouping.length) return initialData;

    return [...initialData].sort((a, b) => {
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

  return { grouping, setGrouping, groupedData };
};

