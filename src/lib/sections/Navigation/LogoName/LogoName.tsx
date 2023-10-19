import { ReactNode } from "react";

export interface NavigationLogoNameProps {
  children: ReactNode;
}

export const LogoName = ({ children }: NavigationLogoNameProps) => {

  return (
    <div className="p-panel__logo-name is-fading-when-collapsed">
      {children}
    </div>
  )
}
