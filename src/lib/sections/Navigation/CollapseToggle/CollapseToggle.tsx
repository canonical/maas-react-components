import { Button, Tooltip, Icon } from "@canonical/react-components";
import classNames from "classnames";

export interface NavigationCollapseToggleProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  className?: string;
}

export const CollapseToggle = ({
  isCollapsed,
  setIsCollapsed,
  className,
}: NavigationCollapseToggleProps): JSX.Element => {
  return (
    // This block keeps giving this error:
    // "Type 'Element' is not assignable to type 'ReactNode'."
    // Might be a bug with react-components.
    <Tooltip
      message={
        <>
          {!isCollapsed ? "collapse" : "expand"}( <code>&#91;</code> )
        </>
      }
      position="right"
    >
      <Button
        appearance="base"
        aria-label={`${!isCollapsed ? "collapse" : "expand"} main navigation`}
        className={classNames(
          "is-dense has-icon is-dark u-no-margin l-navigation-collapse-toggle",
          className
        )}
        onClick={(e) => {
          setIsCollapsed(!isCollapsed);
          // Make sure the button does not have focus
          // .l-navigation remains open with :focus-within
          e.stopPropagation();
          e.currentTarget.blur();
        }}
      >
        <Icon light name="sidebar-toggle" />
      </Button>
    </Tooltip>
  );
};