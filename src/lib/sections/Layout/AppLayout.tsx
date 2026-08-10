import type { ReactElement } from "react";

import Layout from "./Layout";

import Navigation from "@/app/base/components/Navigation";
import SecondaryNavigation from "@/app/base/components/SecondaryNavigation";
import StatusBar from "@/app/base/components/StatusBar";
import type { RoutePath } from "@/app/base/routes";
import { routesConfig } from "@/app/base/routes";
import { useAuthContext } from "@/app/context";
import { matchPath, Outlet, useLocation } from "@/utils/router";

const getPageTitle = (pathname: RoutePath) => {
  const title = Object.values(routesConfig).find(({ path }) => path === pathname)?.title;
  return title ? `${title} | MAAS Site Manager` : "MAAS Site Manager";
};

const AppLayout = (): ReactElement => {
  const { pathname } = useLocation();
  const { status } = useAuthContext();
  const isLoggedIn = status === "authenticated";
  const isSecondaryNavVisible = !!(matchPath("/settings/*", pathname) || matchPath("/account/*", pathname));
  const isTableView = pathname.endsWith("/list") || (pathname.startsWith("/settings/") && pathname !== "/settings/map");

  const pageTitle = getPageTitle(pathname as RoutePath);

  return (
    <Layout
      className="is-maas-site-manager"
      isSecondaryNavVisible={isSecondaryNavVisible}
      navigation={<Navigation isLoggedIn={isLoggedIn} />}
      pageTitle={pageTitle}
      secondaryNavigation={<SecondaryNavigation isOpen={isSecondaryNavVisible} />}
      statusBar={<StatusBar />}
      view={isTableView ? "table" : "settings"}
    >
      <Outlet />
    </Layout>
  );
};

export default AppLayout;
