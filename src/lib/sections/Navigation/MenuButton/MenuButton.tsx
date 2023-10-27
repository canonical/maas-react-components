import { ReactNode } from "react";

import { Button, ButtonProps } from "@canonical/react-components";
import classNames from "classnames";

export interface NavigationMenuButtonProps {
  children: ReactNode;
  className?: string;
  onClick: ButtonProps["onClick"];
}

export const MenuButton = ({ children, className, onClick }: NavigationMenuButtonProps) => {

  return (
    <Button appearance="base" className={classNames("has-icon is-dark", className)} onClick={onClick}>
      {children}
    </Button>
  )
}
