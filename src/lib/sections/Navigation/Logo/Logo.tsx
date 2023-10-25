import { ReactNode } from "react";

export interface NavigationLogoProps {
  children: ReactNode;
}

export const Logo = ({ children }: NavigationLogoProps) => {
   return (
    <a className="p-panel__logo" href="/">
      <div className="p-navigation__tagged-logo">
        {children}
      </div>
    </a>
  )
}
