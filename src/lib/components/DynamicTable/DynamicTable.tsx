import type { AriaAttributes, PropsWithChildren } from "react";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";

import type { RowData, Table } from "@tanstack/react-table";
import classNames from "classnames";

import { BREAKPOINTS } from "@/constants";
import { Placeholder } from "@/lib/elements";
import "./DynamicTable.scss";

const DynamicTableContext = createContext<{
  variant: "full-height" | "regular";
}>({ variant: "regular" });

export type DynamicTableProps = PropsWithChildren<{
  className?: string;
  variant: "full-height" | "regular";
}>;

/**
 * A table based on tanstack/react-table.
 * In a full-height variant has a fixed header and the table body can be scrolled vertically independent of the page itself. The table body will take up the remaining height of the viewport.
 * In a regular variant, the table body will scroll with the page and the header is sticky.
 *
 * @param className A class name to apply to the <table> element
 * @param variant The variant of the table ("full-height" or "regular").
 * @param children The markup of the table itself, composed of <thead> and DynamicTable.Body
 * @returns
 */
export const DynamicTable = ({
  className,
  children,
  variant,
  ...props
}: DynamicTableProps) => {
  return (
    <DynamicTableContext.Provider value={{ variant }}>
      <table
        {...props}
        className={classNames("p-table-dynamic", className, {
          "is-full-height": variant === "full-height",
        })}
      >
        {children}
      </table>
    </DynamicTableContext.Provider>
  );
};

const SkeletonRows = ({ columns }: { columns: Array<{ id: string }> }) => (
  <>
    {Array.from({ length: 10 }, (_, index) => {
      return (
        <tr aria-hidden="true" key={index}>
          {columns.map((column, columnIndex) => {
            return (
              <td
                className={classNames(column.id, "u-text-overflow-clip")}
                key={columnIndex}
              >
                <Placeholder isPending text="XXXxxxx.xxxxxxxxx" />
              </td>
            );
          })}
        </tr>
      );
    })}
  </>
);

const DynamicTableLoading = <TData extends RowData>({
  className,
  table,
}: {
  className?: string;
  table?: Table<TData>;
  placeholderLengths?: { [key: string]: string };
}) => {
  const columns = table
    ? table.getAllColumns()
    : (Array.from({ length: 10 }).fill({ id: "" }) as Array<{ id: string }>);

  return (
    <>
      <caption className="u-visually-hidden">Loading...</caption>
      <DynamicTableBody aria-busy="true" className={className}>
        <SkeletonRows columns={columns} />
      </DynamicTableBody>
    </>
  );
};

interface DynamicTableBodyProps extends AriaAttributes {
  className?: string;
  children: React.ReactNode;
  height?: string;
  style?: React.CSSProperties;
}

const DynamicTableBody = ({
  className,
  children,
  style,
  ...props
}: DynamicTableBodyProps) => {
  const { variant } = useContext(DynamicTableContext);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const [offset, setOffset] = useState<number | null>(null);

  const handleResize = useCallback(() => {
    if (window.innerWidth > BREAKPOINTS.small) {
      const top = tableBodyRef.current?.getBoundingClientRect?.().top;
      if (top) setOffset(top + 1);
    } else {
      setOffset(null);
    }
  }, []);

  useLayoutEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const dynamicStyle = useMemo(() => {
    if (variant === "full-height" && offset) {
      return {
        height: `calc(100vh - ${offset}px)`,
        minHeight: `calc(100vh - ${offset}px)`,
        ...style,
      };
    }
    return style;
  }, [variant, offset, style]);

  return (
    <tbody
      className={className}
      ref={tableBodyRef}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </tbody>
  );
};

DynamicTable.Body = DynamicTableBody;
DynamicTable.Loading = DynamicTableLoading;
