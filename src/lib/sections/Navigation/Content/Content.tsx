import { ReactNode } from "react";

export interface NavigationContentProps {
  children: ReactNode;
}

export const Content = ({ children }: NavigationContentProps) => {

  return (
    <div className="p-panel__content">
      <div className="p-side-navigaiton--icons is-dark">
        {children}
      </div>
    </div>
  )
}