import { ReactNode } from "react";

import { Button } from "@canonical/react-components";

export interface NavigationMenuButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export const MenuButton = ({ children, onClick }: NavigationMenuButtonProps) => {

  return (
    <Button appearance="base" className="has-icon is-dark" onClick={onClick}>
      {children}
    </Button>
  )
}
