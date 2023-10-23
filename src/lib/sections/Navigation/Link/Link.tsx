import { AriaAttributes, ReactNode } from "react";

export interface NavigationLinkProps {
  children: ReactNode;
  to: string;
  current?: AriaAttributes["aria-current"]
}

export const Link = ({ children, current, to }: NavigationLinkProps) => {
  return (
    <a className="p-side-navigation__link" href={to} aria-current={current}>
      {children}
    </a>
  )
}