import { ReactNode } from "react";

export interface NavigationLogoProps {
  children: ReactNode;
}

export const Logo = ({ children }: NavigationLogoProps) => {
   return (
    // This *should* be a Link component, but I really need
    // the compiler to shut up about not existing within
    // a router. This must be fixed later, maybe with an "as" prop.
    // 
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className="p-panel__logo" href="#">
      <div className="p-panel__tagged-logo">
        {children}
      </div>
    </a>
  )
}
