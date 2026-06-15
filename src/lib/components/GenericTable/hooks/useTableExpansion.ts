import { useCallback, useEffect, useState } from "react";

import type { ExpandedState, GroupingState } from "@tanstack/react-table";

import { GenericTableData } from "@/lib/components/GenericTable/types";

export const useTableExpansion = <T extends GenericTableData>({
  grouping,
  initialData,
}: {
  grouping: GroupingState;
  initialData: T[];
}): {
  expanded: ExpandedState;
  setExpanded: (updater: ExpandedState | ((prev: ExpandedState) => ExpandedState)) => void;
} => {
  const [expanded, _setExpanded] = useState<ExpandedState>(true);

  // Remember collapsed groups to keep them collapsed on page change.
  // Stable reference: _setExpanded is a useState setter (never changes).
  const setExpanded = useCallback(
    (updater: ExpandedState | ((prev: ExpandedState) => ExpandedState)) => {
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
    },
    [],
  );

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

  return { expanded, setExpanded };
};
