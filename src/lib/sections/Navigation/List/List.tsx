import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationListProps {
  children: ReactNode;
  className?: string;
  /** Marks the list as collapsible, driving the show/hide transition via vanilla's `aria-expanded` styles. Omit for a list that is always expanded. */
  isExpanded?: boolean;
}

export const List = ({ children, className, isExpanded }: NavigationListProps) => {
  return (
    <ul aria-expanded={isExpanded} className={classNames("p-side-navigation__list", className)}>
      {children}
    </ul>
  )
}
