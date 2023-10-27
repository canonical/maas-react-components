import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationListProps {
  children: ReactNode;
  className?: string;
}

export const List = ({ children, className }: NavigationListProps) => {
  return (
    <ul className={classNames("p-side-navigation__list", className)}>
      {children}
    </ul>
  )
}
