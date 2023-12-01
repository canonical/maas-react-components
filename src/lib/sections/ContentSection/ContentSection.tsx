import * as React from "react";

import { Col } from "@canonical/react-components";
import classNames from "classnames";

import "./ContentSection.scss";
import { AsProp } from "@/types";

interface CommonContentSectionProps extends React.PropsWithChildren {
  className?: string;
  align?: "left" | "center" | "right";
}
export interface ContentSectionProps
  extends CommonContentSectionProps,
    React.HTMLAttributes<HTMLElement>,
    AsProp<React.ElementType>,
    React.PropsWithChildren {}

/**
 * A content section layout component for one of the primary content areas (e.g. main or sidebar).
 *
 * `ContentSection` has three child components:
 * - `ContentSection.Title`
 * - `ContentSection.Content`
 * - `ContentSection.Footer`
 *
 * `ContentSection.Footer` is made sticky by default.
 */
export const ContentSection = ({
  children,
  className,
  as,
  ...props
}: ContentSectionProps) => {
  const Component = as || "section";
  return (
    <Component {...props} className={classNames("content-section", className)}>
      <Col size={12}>{children}</Col>
    </Component>
  );
};

const Title = ({ children, className, as, ...props }: ContentSectionProps) => {
  const Component = as || "h1";
  return (
    <Component
      {...props}
      className={classNames("content-section__title p-heading--4", className)}
    >
      {children}
    </Component>
  );
};

const Content = ({ children, className }: CommonContentSectionProps) => (
  <div className={classNames("content-section__body", className)}>
    {children}
  </div>
);

const Footer = ({ children, className }: CommonContentSectionProps) => (
  <div className={classNames("content-section__footer", className)}>
    {children}
  </div>
);

ContentSection.Title = Title;
ContentSection.Content = Content;
ContentSection.Footer = Footer;
