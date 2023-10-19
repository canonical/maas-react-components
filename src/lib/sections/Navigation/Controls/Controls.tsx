import { ReactNode } from "react";

export interface NavigationControlsProps {
  children: ReactNode;
}

export const Controls = ({ children }: NavigationControlsProps) => {

  return (
    <div className="l-navigation__controls">
      {children}
    </div>
  )
}
