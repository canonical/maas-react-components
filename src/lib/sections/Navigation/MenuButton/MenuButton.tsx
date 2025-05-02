import { ReactNode } from "react";

import { Button, ButtonProps } from "@canonical/react-components";
import classNames from "classnames";

export interface NavigationMenuButtonProps {
  children: ReactNode;
  className?: string;
  onClick: ButtonProps["onClick"];
}

export const MenuButton = ({
  children,
  className,
  onClick,
}: NavigationMenuButtonProps) => {
  return (
    <Button
      appearance="base"
      className={classNames(
        "p-side-navigation__button--menu has-icon is-dark",
        className,
      )}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        // Make sure the button does not have focus
        // .l-navigation remains open with :focus-within
        e.stopPropagation();
        e.currentTarget.blur();
      }}
    >
      <>
        {children}
      </>
    </Button>
  );
};
