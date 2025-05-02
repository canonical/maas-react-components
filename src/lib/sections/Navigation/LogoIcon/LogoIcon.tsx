import { ReactElement, cloneElement, SVGAttributes, HTMLAttributes } from "react";

export interface NavigationLogoIconProps {
  children: ReactElement<SVGAttributes<SVGElement> & HTMLAttributes<HTMLElement>>;
}

export const LogoIcon = ({ children }: NavigationLogoIconProps) => {

  return cloneElement(children, { className: "p-panel__logo-icon p-navigation__logo-icon"})
}
