import { ReactNode } from "react";

export interface NavigationTextProps {
  children: ReactNode;
}

export const Text = ({ children }: NavigationTextProps) => {

  return (
    <span className="p-side-navigation__text">
      {children}
    </span>
  )
}
