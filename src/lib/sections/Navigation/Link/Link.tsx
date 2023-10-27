import { ComponentProps, ElementType } from "react";

import classNames from "classnames";

interface AsProp<C extends ElementType> {
  as?: C;
}

export interface NavigationLinkProps extends ComponentProps<typeof Link> {}

export const Link = <
  C extends ElementType = "a",
  T extends ComponentProps<C> = ComponentProps<C>,
>({
  as,
  ...props
}: AsProp<C> & Omit<T, "as">) => {
  const Component = as || "a";
  return (
    <Component
      className={classNames("p-side-navigation__link", props.className)}
      {...props}
    />
  );
};
