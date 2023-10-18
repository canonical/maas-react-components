import { ReactNode, SVGProps } from "react";

import { Button, Icon as VanillaIcon, Tooltip } from "@canonical/react-components";
import classNames from "classnames";

export interface NavigationProps {
  children: ReactNode;
}

export const Navigation = ({ children }: NavigationProps) => {

  return <>{children}</>;
};

export interface NavigationBarProps {
  children: ReactNode;
  className?: string;
}

const Bar = ({ children, className }: NavigationBarProps) => {
  
  return (
    <header aria-label="navigation" className="l-navigation-bar">
      <div className={classNames("p-panel is-dark", className)}>
        {children}
      </div>
    </header>
  )
}

export interface NavigationHeaderProps {
  children: ReactNode;
}

const Header = ({ children }: NavigationHeaderProps) => {

  return (
    <div className="p-panel__header">
      {children}
    </div>
  )
}

export interface NavigationBannerProps {
  children: ReactNode;
}

const Banner = ({ children }: NavigationBannerProps) => {

  return (
    <>
      {children}
    </>
  )
}

export interface NavigationLogoProps {
  children: ReactNode;
}

const Logo = ({ children }: NavigationLogoProps) => {
   return (
    // This *should* be a Link component, but I really need
    // the compiler to shut up about not existing within
    // a router. This must be fixed later, maybe with an "as" prop.
    // 
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className="p-panel__logo" href="#">
      <div className="p-panel__tagged-logo">
        {children}
      </div>
    </a>
  )
}

export interface NavigationLogoTagProps {
  children: ReactNode;
}

const LogoTag = ({ children }: NavigationLogoTagProps) => {

  return (
    <div className="p-navigation__logo-tag">
      {children}
    </div>
  )
}

export interface NavigationLogoIconProps {
  children: ReactNode;
}

const LogoIcon = ({ children, ...props }: NavigationLogoIconProps & SVGProps<SVGSVGElement>) => {

  return (
    <svg {...props} className="p-panel__logo-icon p-navigation__logo-icon">
      {children}
    </svg>
  )
}

export interface NavigationLogoNameProps {
  children: ReactNode;
}

const LogoName = ({ children }: NavigationLogoNameProps) => {

  return (
    <div className="p-panel__logo-name is-fading-when-collapsed">
      {children}
    </div>
  )
}

export interface NavigationPanelControlsProps {
  children: ReactNode;
}

const PanelControls = ({ children }: NavigationPanelControlsProps) => {

  return (
    <div className="p-panel__controls u-nudge-down--small u-no-margin--top">
      {children}
    </div>
  )
}

export interface NavigationMenuButtonProps {
  label: string;
  onClick: () => void;
}

const MenuButton = ({ label, onClick }: NavigationMenuButtonProps) => {

  return (
    <Button appearance="base" className="has-icon is-dark" onClick={onClick}>
      {label}
    </Button>
  )
}

export interface NavigationNavProps {
  children: ReactNode;
  className?: string;
  isCollapsed: boolean;
}

const Nav = ({ children, className, isCollapsed }: NavigationNavProps) => {

  return (
    <nav aria-label="main navigation" className={classNames("l-navigation is-maas", className, { "is-collapsed": isCollapsed, "is-pinned": !isCollapsed})}>
      {children}
    </nav>
  )
}

export interface NavigationDrawerProps {
  children: ReactNode;
}

const Drawer = ({ children }: NavigationDrawerProps) => {

  return (
    <div className="l-navigation__drawer">
      <div className="p-panel is-dark">
        {children}
      </div>
    </div>
  )
}

export interface NavigationControlsProps {
  children: ReactNode;
}

const Controls = ({ children }: NavigationControlsProps) => {

  return (
    <div className="l-navigation__controls">
      {children}
    </div>
  )
}

export interface NavigationCollapseToggleProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  className?: string;
}

const CollapseToggle = ({
  isCollapsed,
  setIsCollapsed,
  className,
}: NavigationCollapseToggleProps): JSX.Element => {
  return (
    // {/* @ts-nocheck */}
    <Tooltip
      message={
        <>
          {!isCollapsed ? "collapse" : "expand"}( <code>&#91;</code> )
        </>
      }
      position="right"
    >
      <Button
        // {/* @ts-nocheck */}
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
        <VanillaIcon light name="sidebar-toggle" />
      </Button>
    </Tooltip>
  );
};

export interface NavigationContentProps {
  children: ReactNode;
}

const Content = ({ children }: NavigationContentProps) => {

  return (
    <div className="p-panel__content">
      <div className="p-side-navigaiton--icons is-dark">
        {children}
      </div>
    </div>
  )
}

export interface NavigationListProps {
  children: ReactNode;
}

const List = ({ children }: NavigationListProps) => {
  return (
    <ul className="p-side-navigation__list">
      {children}
    </ul>
  )
}

// Groups are kind of weird since they're basically just an item.
// Leaving this commented out for now, might need this but might not.
// 
// export interface NavigationGroupProps {
//   children: ReactNode;
// }

// const Group = ({ children }: NavigationGroupProps) => {
  
//   return (
//     <Item>
//       {children}
//     </Item>
//   )
// }

export interface NavigationItemProps {
  children: ReactNode;
}

const Item = ({ children }: NavigationItemProps) => {
  return (
    <li className="p-side-navigation__item">
      {children}
    </li>
  )
}

export interface NavigationTextProps {
  children: ReactNode;
}

const Text = ({ children }: NavigationTextProps) => {

  return (
    <span className="p-side-navigation__text">
      {children}
    </span>
  )
}

export interface NavigationIconProps {
  light?: boolean;
  name: string;
}

const Icon = ({ light=true, name }: NavigationIconProps) => {
  
  return (
    <VanillaIcon className="p-side-navigation__icon" light={light} name={name}/>
  )
}

export interface NavigationLabelProps {
  text: string;
  variant?: "base" | "group";
}

const Label = ({ text, variant="base" }: NavigationLabelProps) => {

  return (
    <span className={classNames("p-side-navigation__label", { "p-heading--small": variant === "group" })}>
      {text}
    </span>
  )
}

Navigation.Bar = Bar;
Navigation.Header = Header;
Navigation.Banner = Banner;
Navigation.Logo = Logo;
Navigation.LogoTag = LogoTag;
Navigation.LogoIcon = LogoIcon;
Navigation.LogoName = LogoName;
Navigation.PanelControls = PanelControls;
Navigation.MenuButton = MenuButton;
Navigation.Nav = Nav;
Navigation.Drawer = Drawer;
Navigation.Controls = Controls;
Navigation.CollapseToggle = CollapseToggle;
Navigation.Content = Content;
Navigation.List = List;
Navigation.Item = Item;
Navigation.Text = Text;
Navigation.Icon = Icon;
Navigation.Label = Label;
