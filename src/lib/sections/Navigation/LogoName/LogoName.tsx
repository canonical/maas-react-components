import { ReactNode } from "react";

import classNames from "classnames";

export interface NavigationLogoNameProps {
  children: ReactNode;
  variant?: "base" | "small";
}

export const LogoName = ({ children, variant = "base" }: NavigationLogoNameProps) => {
  return (
    <div
      className={classNames("p-panel__logo-name is-fading-when-collapsed", {
        "p-panel__logo-name--small": variant === "small",
      })}
    >
      {children}
    </div>
  );
};
