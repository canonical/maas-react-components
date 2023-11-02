import { ReactNode } from "react";

import classNames from "classnames";

import { Banner } from "./Banner/Banner";
import { CollapseToggle } from "./CollapseToggle/CollapseToggle";
import { Content } from "./Content/Content";
import { Controls } from "./Controls/Controls";
import { Drawer } from "./Drawer/Drawer";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Icon } from "./Icon/Icon";
import { Item } from "./Item/Item";
import { Label } from "./Label/Label";
import { Link } from "./Link/Link";
import { List } from "./List/List";
import { Logo } from "./Logo/Logo";
import { LogoIcon } from "./LogoIcon/LogoIcon";
import { LogoName } from "./LogoName/LogoName";
import { LogoTag } from "./LogoTag/LogoTag";
import { LogoText } from "./LogoText/LogoText";
import { MenuButton } from "./MenuButton/MenuButton";
import { Text } from "./Text/Text";

import "./Navigation.scss";

export interface NavigationProps {
  children: ReactNode;
  className?: string;
  isCollapsed: boolean;
}

export const Navigation = ({ children, className, isCollapsed }: NavigationProps) => {

  return (
    <header aria-label="main navigation" className={classNames("l-navigation is-maas", className, { "is-collapsed": isCollapsed, "is-pinned": !isCollapsed})}>
      {children}
    </header>
  )
};

export interface NavigationBarProps {
  children: ReactNode;
  className?: string;
}

export const NavigationBar = ({ children, className }: NavigationBarProps) => {
  
  return (
    <header aria-label="navigation" className="l-navigation-bar">
      <div className={classNames("p-panel is-dark", className)}>
        {children}
      </div>
    </header>
  )
}

Navigation.Header = Header;
Navigation.Banner = Banner;
Navigation.Drawer = Drawer;
Navigation.Controls = Controls;
Navigation.CollapseToggle = CollapseToggle;
Navigation.Content = Content;
Navigation.Footer = Footer;
Navigation.List = List;
Navigation.Item = Item;
Navigation.Link = Link;
Navigation.Text = Text;
Navigation.Icon = Icon;
Navigation.Label = Label;
Navigation.Logo = Logo;
Navigation.LogoTag = LogoTag;
Navigation.LogoIcon = LogoIcon;
Navigation.LogoName = LogoName;
Navigation.LogoText = LogoText;

NavigationBar.MenuButton = MenuButton;
