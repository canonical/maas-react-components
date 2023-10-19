import { ReactNode } from "react";

export interface NavigationHeaderProps {
  children: ReactNode;
}

export const Header = ({ children }: NavigationHeaderProps) => {

  return (
    <div className="p-panel__header">
      {children}
    </div>
  )
}