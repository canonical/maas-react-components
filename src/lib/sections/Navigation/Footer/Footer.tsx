import { ReactNode } from "react";

export interface NavigationFooterProps {
  children: ReactNode;
}

export const Footer = ({ children }: NavigationFooterProps) => {
  return <div className="p-panel__footer">{children}</div>;
};
