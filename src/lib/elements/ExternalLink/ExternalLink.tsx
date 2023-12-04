import { Link, LinkProps } from "@canonical/react-components";
import type { LinkProps as RouterLinkProps } from "react-router-dom";

type ExternalLinkProps = Pick<LinkProps, "children"> &
  Omit<RouterLinkProps, "children"> & { to: string };
export const ExternalLink = ({ children, to, ...props }: ExternalLinkProps) => (
  <Link {...props} href={to} rel="noreferrer noopener" target="_blank">
    {children}
  </Link>
);
