import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationLabelProps {
  children: ReactNode;
  id?: string;
  variant?: "base" | "group";
}

export const Label = ({ children, id, variant="base" }: NavigationLabelProps) => {

  return (
    <span className={classNames("p-side-navigation__label", { "p-side-navigation__label--group": variant === "group" })} id={id}>
      {children}
    </span>
  )
}
