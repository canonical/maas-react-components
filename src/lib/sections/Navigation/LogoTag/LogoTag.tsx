import { ReactNode } from "react";

export interface NavigationLogoTagProps {
  children: ReactNode;
}

export const LogoTag = ({ children }: NavigationLogoTagProps) => {

  return (
    <div className="p-navigation__logo-tag">
      {children}
    </div>
  )
}
