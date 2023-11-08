import { ComponentProps, ElementType, ReactNode } from "react";

import classNames from "classnames";

import { AsProp } from "@/lib/sections/Navigation/types";

export interface NavigationLogoProps extends ComponentProps<typeof Logo> {
  children: ReactNode;
}

export const Logo = <
C extends ElementType = "a",
T extends ComponentProps<C> = ComponentProps<C>,
>({ as, children, className, ...props }: AsProp<C> & Omit<T, "as">) => {
  const Component = as || "a";
   return (
    <Component className={classNames("p-panel__logo", className)} {...props}>
      <div className="p-navigation__tagged-logo">
        {children}
      </div>
    </Component>
  )
}
