import { ReactElement, cloneElement } from "react";

export interface NavigationLogoIconProps {
  children: ReactElement;
}

export const LogoIcon = ({ children }: NavigationLogoIconProps) => {

  return cloneElement(children, { className: "p-panel__logo-icon p-navigation__logo-icon"})
}
