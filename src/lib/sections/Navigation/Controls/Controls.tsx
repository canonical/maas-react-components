import { ReactNode } from "react";

export interface NavigationPanelControlsProps {
  children: ReactNode;
}

export const Controls = ({ children }: NavigationPanelControlsProps) => {

  return (
    <div className="p-panel__controls u-nudge-down--small u-no-margin--top">
      {children}
    </div>
  )
}
