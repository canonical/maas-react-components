import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationLabelProps {
  children: ReactNode;
  variant?: "base" | "group";
}

export const Label = ({ children, variant="base" }: NavigationLabelProps) => {

  return (
    <span className={classNames("p-side-navigation__label", { "p-side-navigation__label--group": variant === "group" })}>
      {children}
    </span>
  )
}
