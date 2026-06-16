import { RefObject, useLayoutEffect, useRef, useState } from "react";

export const useTableScrollHeight = ({
  containerRef,
  variant,
  length,
  isLoading,
}: {
  containerRef?: RefObject<HTMLElement | null>;
  variant: "full-height" | "regular";
  length: number;
  isLoading: boolean;
}): {
  tableBodyRef: RefObject<HTMLTableSectionElement | null>;
  maxHeight: string;
  effectiveVariant: "full-height" | "regular";
} => {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const [maxHeight, setMaxHeight] = useState("auto");
  const [needsScrolling, setNeedsScrolling] = useState(false);

  // Update table height based on available space and determine if scrolling is needed
  useLayoutEffect(() => {
    const updateHeight = () => {
      const wrapper = tableBodyRef.current;
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
    const wrapper = tableBodyRef.current;
    if (wrapper) resizeObserver.observe(wrapper);

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      if (wrapper) resizeObserver.unobserve(wrapper);
    };
  }, [containerRef, length, isLoading]);

  // Determine the effective variant based on content and scrolling needs
  const effectiveVariant =
    variant === "full-height" && needsScrolling ? "full-height" : "regular";

  return { tableBodyRef, maxHeight, effectiveVariant };
};
