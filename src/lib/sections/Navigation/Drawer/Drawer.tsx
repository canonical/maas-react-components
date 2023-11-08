import { ReactNode } from "react";

export interface NavigationDrawerProps {
  children: ReactNode;
}

export const Drawer = ({ children }: NavigationDrawerProps) => {

  return (
    <div className="l-navigation__drawer">
      <div className="p-panel is-dark">
        {children}
      </div>
    </div>
  )
}
