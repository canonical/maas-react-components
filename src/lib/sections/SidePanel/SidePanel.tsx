import type { ReactElement } from "react";
import { useEffect } from "react";

import { AppAside, useOnEscapePressed } from "@canonical/react-components";
import classNames from "classnames";
import { useLocation } from "react-router";

import { useSidePanel } from "./SidePanelContextProvider/SidePanelContextProvider";

import { ContentSection } from "@/lib/sections/ContentSection";


const useCloseSidePanelOnRouteChange = (): void => {
  const location = useLocation();
  const { closeSidePanel } = useSidePanel();

  useEffect(
    () => {
      closeSidePanel();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, location.search, location.hash]
  );
};

const useResetSidePanelOnUnmount = (): void => {
  const { setSidePanelSize } = useSidePanel();

  // reset side panel size to default on unmounting
  useEffect(
    () => {
      return () => {
        setSidePanelSize("regular");
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

const useCloseSidePanelOnEscPressed = (): void => {
  const { closeSidePanel } = useSidePanel();
  useOnEscapePressed(() => {
    closeSidePanel();
  });
};

/**
 * Slide-in aside panel rendered at the edge of the page.
 *
 * Reads all state from the nearest `SidePanelContextProvider` via `useSidePanel`.
 * The panel has no props of its own — open it by calling `openSidePanel` from the hook.
 *
 * Behaviour:
 * - Collapses automatically when the current route changes
 * - Closes when the Escape key is pressed
 * - Resets its size to `"regular"` on unmount
 *
 * Size variants (set via `openSidePanel` or `setSidePanelSize`):
 * - `"narrow"` — adds the `is-narrow` CSS modifier
 * - `"regular"` — default, no modifier class
 * - `"wide"` — adds the `is-wide` CSS modifier
 * - `"large"` — adds the `is-large` CSS modifier
 *
 * @requires SidePanelContextProvider — must be present higher in the tree
 * @requires A React Router context — must be rendered inside a Router
 *
 * @example
 * ```tsx
 * // In your app root:
 * <SidePanelContextProvider>
 *   <Router>
 *     <main>…</main>
 *     <SidePanel />
 *   </Router>
 * </SidePanelContextProvider>
 *
 * // Anywhere in the tree:
 * const { openSidePanel } = useSidePanel();
 * openSidePanel({ component: EditForm, title: "Edit item", size: "wide" });
 * ```
 */
const SidePanel = (): ReactElement => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();

  const { isOpen, title, component: Component, props, size } = useSidePanel();

  return (
    <AppAside
      aria-label={title ?? undefined}
      className={classNames({
        "is-narrow": size === "narrow",
        "is-large": size === "large",
        "is-wide": size === "wide",
      })}
      collapsed={!isOpen}
      id="aside-panel"
    >
      <ContentSection>
        {title ? (
          <div className="row section-header section-header--side-panel">
            <div className="col-12">
              <h3 className="section-header__title u-flex--no-shrink p-heading--4">
                {title}
              </h3>
            </div>
          </div>
        ) : null}
        {isOpen && Component && <Component {...props} />}
      </ContentSection>
    </AppAside>
  );
};

export default SidePanel;
