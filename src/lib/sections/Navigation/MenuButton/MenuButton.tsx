import { ReactNode } from "react";

import { Button, ButtonProps } from "@canonical/react-components";

export interface NavigationMenuButtonProps {
  children: ReactNode;
  onClick: ButtonProps["onClick"];
}

export const MenuButton = ({ children, onClick }: NavigationMenuButtonProps) => {

  return (
    <Button appearance="base" className="has-icon is-dark" onClick={onClick}>
      {children}
    </Button>
  )
}
