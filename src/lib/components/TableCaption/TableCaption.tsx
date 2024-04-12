import type { PropsWithChildren } from "react";

type TableCationProps = PropsWithChildren;

/**
 * A caption that can be displayed instead of a table body.
 *
 * @param children The body of the caption
 * @returns
 */
export const TableCaption = ({ children }: TableCationProps) => (
  <caption>
    <div className="p-strip">{children}</div>
  </caption>
);

const Title = ({ children }: TableCationProps) => (
  <div className="row">
    <div className="col-start-large-4 u-align--left col-8 col-medium-4">
      <p className="p-heading--4 u-no-margin--bottom">{children}</p>
    </div>
  </div>
);

const Description = ({ children }: TableCationProps) => (
  <div className="row">
    <div className="u-align--left col-start-large-4 col-8 col-medium-4">
      <p>{children}</p>
    </div>
  </div>
);

TableCaption.Title = Title;
TableCaption.Description = Description;
