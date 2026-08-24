import { ComponentType, lazy, Suspense } from "react";

import { SidePanel } from "./SidePanel";

import { ContentSection } from "@/lib/sections/ContentSection";


/**
 * Lazily loads a side panel component wrapped in its own Suspense boundary.
 * Define the panel at module scope in the file that opens it and pass it
 * straight to `openSidePanel`:
 *
 * @example
 * const AddUser = lazySidePanel(() => import("./UserAddForm"));
 * // ...
 * openSidePanel({ component: AddUser, title: "Add user" });
 *
 * The `<SidePanel />` component from `@canonical/maas-react-components` renders
 * the panel component directly, so a bare `React.lazy` panel would suspend the
 * whole `<SidePanel />` on first open. That remounts `<SidePanel />`, and on
 * remount its internal "close on navigation" effect runs and immediately closes
 * the panel that was just opened. Giving each panel its own Suspense boundary
 * keeps `<SidePanel />` mounted (and open) while the chunk loads, and shows the
 * spinner inside the panel.
 */
export const lazyLoadSidePanel = <
  P extends Record<string, unknown> = Record<string, unknown>,
>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  showSkeletonTitle?: boolean
): ComponentType => {
  const LazyPanel = lazy(loader);
  const SidePanelContent = (props: P) => (
    <Suspense
      fallback={
        <ContentSection>
          <SidePanel.Skeleton hasTitle={showSkeletonTitle} />
        </ContentSection>
      }
    >
      <LazyPanel {...props} />
    </Suspense>
  );
  return SidePanelContent as ComponentType;
};