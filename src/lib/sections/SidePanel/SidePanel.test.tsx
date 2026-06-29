import type { ComponentType } from "react";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router";

import { SidePanel } from "./SidePanel";
import {
  SidePanelContextProvider,
  useSidePanel,
} from "./SidePanelContextProvider/SidePanelContextProvider";

const TestContent = () => <p>Panel content</p>;

const renderWithSidePanelContext = (initialPath = "/") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SidePanelContextProvider>
        <SidePanel />
      </SidePanelContextProvider>
    </MemoryRouter>,
  );

const OpenPanelButton = ({
  component,
  title = "Test Title",
  size,
}: {
  component: ComponentType<Record<string, unknown>>;
  title?: string;
  size?: "narrow" | "regular" | "wide" | "large";
}) => {
  const { openSidePanel } = useSidePanel();
  return (
    <button onClick={() => openSidePanel({ component, title, size })}>
      Open
    </button>
  );
};

const ClosePanelButton = () => {
  const { closeSidePanel } = useSidePanel();
  return <button onClick={closeSidePanel}>Close</button>;
};

const NavigateButton = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  return <button onClick={() => navigate(to)}>Navigate</button>;
};

const renderWithControls = (initialPath = "/") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SidePanelContextProvider>
        <OpenPanelButton component={TestContent} />
        <ClosePanelButton />
        <NavigateButton to="/other" />
        <SidePanel />
      </SidePanelContextProvider>
    </MemoryRouter>,
  );

describe("SidePanel", () => {
  it("renders without crashing", () => {
    renderWithSidePanelContext();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    renderWithSidePanelContext();
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
  });

  it("renders the component content when opened", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("renders the panel title when opened", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
  });

  it("uses the title as the accessible label for the aside element", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("complementary", { name: "Test Title" })).toBeInTheDocument();
  });

  it("hides the component content after closing", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
  });

  it("closes when the Escape key is pressed", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
  });

  it("closes when the route changes", async () => {
    renderWithControls();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Navigate" }));
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
  });

  describe("size variants", () => {
    const renderWithSize = async (
      size: "narrow" | "regular" | "wide" | "large",
    ) => {
      render(
        <MemoryRouter>
          <SidePanelContextProvider>
            <OpenPanelButton component={TestContent} size={size} />
            <SidePanel />
          </SidePanelContextProvider>
        </MemoryRouter>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      return screen.getByRole("complementary");
    };

    it("applies the narrow class when size is narrow", async () => {
      const aside = await renderWithSize("narrow");
      expect(aside).toHaveClass("is-narrow");
    });

    it("applies the wide class when size is wide", async () => {
      const aside = await renderWithSize("wide");
      expect(aside).toHaveClass("is-wide");
    });

    it("applies the large class when size is large", async () => {
      const aside = await renderWithSize("large");
      expect(aside).toHaveClass("is-large");
    });

    it("applies no size modifier class for the regular size", async () => {
      const aside = await renderWithSize("regular");
      expect(aside).not.toHaveClass("is-narrow", "is-wide", "is-large");
    });
  });
});

describe("useSidePanel", () => {
  it("throws when used outside of SidePanelContextProvider", () => {
    const ConsumerWithoutProvider = () => {
      useSidePanel();
      return null;
    };

    expect(() =>
      render(
        <MemoryRouter>
          <ConsumerWithoutProvider />
        </MemoryRouter>,
      ),
    ).toThrow("useSidePanel must be used within a SidePanelProvider");
  });

  it("updates the panel size via setSidePanelSize", async () => {
    const SetSizeButton = () => {
      const { setSidePanelSize } = useSidePanel();
      return (
        <button onClick={() => setSidePanelSize("wide")}>Set wide</button>
      );
    };

    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <OpenPanelButton component={TestContent} />
          <SetSizeButton />
          <SidePanel />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const aside = screen.getByRole("complementary");
    expect(aside).not.toHaveClass("is-wide");
    await userEvent.click(screen.getByRole("button", { name: "Set wide" }));
    expect(aside).toHaveClass("is-wide");
  });

  it("resets size to regular when the panel is closed", async () => {
    const SetSizeButton = () => {
      const { setSidePanelSize } = useSidePanel();
      return (
        <button onClick={() => setSidePanelSize("wide")}>Set wide</button>
      );
    };

    render(
      <MemoryRouter>
        <SidePanelContextProvider>
          <OpenPanelButton component={TestContent} />
          <ClosePanelButton />
          <SetSizeButton />
          <SidePanel />
        </SidePanelContextProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("button", { name: "Set wide" }));
    expect(screen.getByRole("complementary")).toHaveClass("is-wide");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("complementary")).not.toHaveClass("is-wide");
  });
});
