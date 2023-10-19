import { ReactNode, SVGProps } from "react";

export interface NavigationLogoIconProps {
  children: ReactNode;
}

export const LogoIcon = ({ children, ...props }: NavigationLogoIconProps & SVGProps<SVGSVGElement>) => {

  return (
    <svg {...props} className="p-panel__logo-icon p-navigation__logo-icon">
      {children}
    </svg>
  )
}
