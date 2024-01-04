import * as React from "react";

import { Col, Row } from "@canonical/react-components";
import classNames from "classnames";

import "./ContentSection.scss";
import { AsProp } from "@/types";

interface CommonContentSectionProps extends React.PropsWithChildren {
  className?: string;
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
  variant = "wide",
  ...props
}: ContentSectionProps & {
  variant?: "narrow" | "wide";
}) => {
  const Component = as || "section";
  const sectionClass = classNames("content-section", className);
  return (
    <Component {...props} className={sectionClass}>
      <Row>
        <Col size={variant === "narrow" ? 6 : 12}>{children}</Col>
      </Row>
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

const Header = ({ children, className }: CommonContentSectionProps) => (
  <header className={classNames("content-section__header", className)}>
    {children}
  </header>
);

const Content = ({ children, className }: CommonContentSectionProps) => (
  <div className={classNames("content-section__body", className)}>
    {children}
  </div>
);

const Footer = ({ children, className }: CommonContentSectionProps) => (
  <footer className={classNames("content-section__footer", className)}>
    {children}
  </footer>
);

ContentSection.Title = Title;
ContentSection.Header = Header;
ContentSection.Content = Content;
ContentSection.Footer = Footer;
