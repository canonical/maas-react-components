import { Link, LinkProps } from "@canonical/react-components";

type ExternalLinkProps = Omit<LinkProps, "href"> & { to: string };

export const ExternalLink = ({ children, to, ...props }: ExternalLinkProps) => (
  <Link {...props} href={to} rel="noreferrer noopener" target="_blank">
    {children}
  </Link>
);
