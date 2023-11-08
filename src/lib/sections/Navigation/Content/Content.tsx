import { ReactNode } from "react";

export interface NavigationContentProps {
  children: ReactNode;
}

export const Content = ({ children }: NavigationContentProps) => {

  return (
    <div className="p-panel__content">
      <nav className="p-side-navigation--icons is-dark">
        {children}
      </nav>
    </div>
  )
}