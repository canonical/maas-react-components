import { ComponentProps, lazy } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterAll, beforeAll } from "vitest";

import { Layout, SidePanelContextProvider } from "@/lib";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  // @ts-expect-error cleanup
  delete global.ResizeObserver;
});

const layoutProps: ComponentProps<typeof Layout> = {
  isSecondaryNavVisible: false,
  navigation: null,
  pageTitle: "MAAS Site Manager",
  secondaryNavigation: null,
  view: "settings",
  children: <div />,
};

describe("Layout", () => {
  it("applies 'is-open' class to secondary nav when isSecondaryNavVisible is true", () => {
    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout
            {...layoutProps}
            isSecondaryNavVisible={true}
            secondaryNavigation={<nav data-testid="secondary-nav">Sub Nav</nav>}
          />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    const navContainer = screen.getByTestId("secondary-nav").parentElement;
    expect(navContainer).toHaveClass("l-main__nav");
    expect(navContainer).toHaveClass("is-open");
  });

  it("sets the document title to the pageTitle value", async () => {
    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout {...layoutProps} pageTitle="Test Page Title" />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe("Test Page Title");
    });
  });

  it("renders the SidePanel", () => {
    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout {...layoutProps} />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    expect(document.getElementById("aside-panel")).toBeInTheDocument();
  });

  it("renders the status bar when provided", () => {
    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout
            {...layoutProps}
            statusBar={<footer data-testid="status-bar">Status</footer>}
          />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("status-bar")).toBeInTheDocument();
  });

  it("shows settings skeleton as Suspense fallback when view is 'settings'", () => {
    const LazyChild = lazy(
      () => new Promise<{ default: React.ComponentType }>(() => {}),
    );

    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout {...layoutProps} view="settings">
            <LazyChild />
          </Layout>
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    const skeleton = document.querySelector(".layout-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(
      document.querySelectorAll(".layout-skeleton__form-field"),
    ).toHaveLength(3);
  });

  it("shows table skeleton as Suspense fallback when view is 'table'", () => {
    const LazyChild = lazy(
      () => new Promise<{ default: React.ComponentType }>(() => {}),
    );

    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <Layout {...layoutProps} view="table">
            <LazyChild />
          </Layout>
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    const skeleton = document.querySelector(".layout-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(
      document.querySelector(".layout-skeleton__pagination"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".layout-skeleton__table"),
    ).toBeInTheDocument();
  });
});
