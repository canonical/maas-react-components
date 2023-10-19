import { ReactNode } from "react";

export interface NavigationItemProps {
  children: ReactNode;
}

export const Item = ({ children }: NavigationItemProps) => {
  return (
    <li className="p-side-navigation__item">
      {children}
    </li>
  )
}