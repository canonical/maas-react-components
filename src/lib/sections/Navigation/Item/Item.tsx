import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationItemProps {
  children: ReactNode;
  className?: string;
  hasActiveChild?: boolean;
}

export const Item = ({ children, className, hasActiveChild }: NavigationItemProps) => {
  return (
    <li className={classNames("p-side-navigation__item", className, { "has-active-child": hasActiveChild })}>
      {children}
    </li>
  )
}