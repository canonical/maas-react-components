import { ReactNode } from "react";

export interface NavigationTextProps {
  children: ReactNode;
}

export const LogoText = ({ children }: NavigationTextProps) => {

  return (
    <span className="p-panel__logo-text">
      {children}
    </span>
  )
}
