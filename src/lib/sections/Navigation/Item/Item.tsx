import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationItemProps {
  children: ReactNode;
  className?: string;
}

export const Item = ({ children, className }: NavigationItemProps) => {
  return (
    <li className={classNames("p-side-navigation__item", className)}>
      {children}
    </li>
  )
}