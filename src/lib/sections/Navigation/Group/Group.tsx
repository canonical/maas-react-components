import { ReactNode } from "react";

import { Icon } from "@/lib/sections/Navigation/Icon/Icon";
import { Item } from "@/lib/sections/Navigation/Item/Item";
import { Label } from "@/lib/sections/Navigation/Label/Label";
import { List } from "@/lib/sections/Navigation/List/List";

export interface NavigationGroupProps {
  children: ReactNode;
  className?: string;
  hasActiveChild?: boolean;
  icon?: string;
  isExpanded: boolean;
  label: string;
  setIsExpanded: (isExpanded: boolean) => void;
}

export const Group = ({
  children,
  className,
  hasActiveChild,
  icon,
  isExpanded,
  label,
  setIsExpanded,
}: NavigationGroupProps) => {
  return (
    <Item className={className} hasActiveChild={hasActiveChild}>
      <button
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "hide" : "show"} submenu for ${label}`}
        className="p-side-navigation__link is-expandable"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        {icon && <Icon name={icon} />}
        <Label>{label}</Label>
      </button>
      <List>
        {children}
      </List>
    </Item>
  )
}
