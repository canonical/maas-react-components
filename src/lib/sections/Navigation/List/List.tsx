import { ReactNode } from "react";

export interface NavigationListProps {
  children: ReactNode;
}

export const List = ({ children }: NavigationListProps) => {
  return (
    <ul className="p-side-navigation__list">
      {children}
    </ul>
  )
}
