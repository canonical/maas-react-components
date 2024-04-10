import type { AriaAttributes, PropsWithChildren, RefObject } from "react";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";

import type { RowData, Table } from "@tanstack/react-table";
import classNames from "classnames";

import { BREAKPOINTS } from "@/constants";
import { Placeholder } from "@/lib/elements";
import "./DynamicTable.scss";

export type DynamicTableProps = PropsWithChildren<{ className?: string }>;

/**
 * A table based on tanstack/react-table with a fixed header, where the table body can be scrolled vertically independent of the page itself.
 *
 * @param className A class name to apply to the <table> element
 * @param children The markup of the table itself, composed of <thead> and DynamicTable.Body
 * @returns
 */
export const DynamicTable = ({
  className,
  children,
  ...props
}: DynamicTableProps) => {
  return (
    <table {...props} className={classNames("p-table-dynamic", className)}>
      {children}
    </table>
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
/**
 * sets a fixed height for the table body
 * allowing it to be scrolled independently of the page
 */
const DynamicTableBody = ({
  className,
  children,
  ...props
}: PropsWithChildren<{ className?: string } & AriaAttributes>) => {
  const tableBodyRef: RefObject<HTMLTableSectionElement> = useRef(null);
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

  return (
    <tbody
      className={className}
      ref={tableBodyRef}
      style={
        offset
          ? {
              height: `calc(100vh - ${offset}px)`,
              minHeight: `calc(100vh - ${offset}px)`,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </tbody>
  );
};
DynamicTable.Body = DynamicTableBody;
DynamicTable.Loading = DynamicTableLoading;
