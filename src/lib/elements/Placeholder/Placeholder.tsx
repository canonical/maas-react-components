import type { ReactNode, CSSProperties } from "react";
import "./Placeholder.scss";

import classNames from "classnames";

export type PlaceholderProps = {
  className?: string;
  isPending?: boolean;
  style?: CSSProperties;
} & (
  | {
      text?: never;
      children?: ReactNode;
    }
  | {
      text?: string;
      children?: never;
    }
);

export const Placeholder = ({
  text,
  children,
  className,
  isPending = false,
  style,
}: PlaceholderProps) => {
  const delay = Math.floor(Math.random() * 750);
  if (isPending) {
    return (
      <span
        aria-label="loading"
        className={classNames("p-placeholder", className)}
        role="progressbar"
        style={{ animationDelay: `${delay}ms`, ...style }}
      >
        <span aria-hidden="true">{text || children || "Loading"}</span>
      </span>
    );
  }
  return <>{children}</>;
};
