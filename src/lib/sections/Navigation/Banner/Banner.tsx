import { ReactNode } from "react";

export interface NavigationBannerProps {
  children: ReactNode;
}

export const Banner = ({ children }: NavigationBannerProps) => {

  return (
    <>
      {children}
    </>
  )
}
