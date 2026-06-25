import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import SidePanel from "@/lib/sections/SidePanel/SidePanel";
import SidePanelContextProvider, {
  useSidePanel,
} from "@/lib/sections/SidePanel/SidePanelContextProvider/SidePanelContextProvider";

type SidePanelSize = "narrow" | "regular" | "wide" | "large";

// --- Sample content components ---

const ExampleFormContent = () => (
  <div>
    <p>
      Use this panel to perform contextual actions without navigating away from
      the current page.
    </p>
    <div className="u-sv2">
      <label htmlFor="name-field">Name</label>
      <input className="p-form-validation__input" id="name-field" type="text" />
    </div>
    <div className="u-sv2">
      <label htmlFor="description-field">Description</label>
      <textarea id="description-field" rows={4} />
    </div>
  </div>
);

// --- Story helpers ---

const AutoOpenPanel = ({
  title,
  size = "regular",
}: {
  title: string;
  size?: SidePanelSize;
}) => {
  const { openSidePanel } = useSidePanel();
  useEffect(() => {
    openSidePanel({ component: ExampleFormContent, title, size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const TogglePanelButton = ({
  title,
  size = "regular",
}: {
  title: string;
  size?: SidePanelSize;
}) => {
  const { openSidePanel, closeSidePanel, isOpen } = useSidePanel();
  return (
    <Button
      onClick={() =>
        isOpen
          ? closeSidePanel()
          : openSidePanel({ component: ExampleFormContent, title, size })
      }
    >
      {isOpen ? "Close panel" : "Open panel"}
    </Button>
  );
};

const meta: Meta<typeof SidePanel> = {
  title: "sections/SidePanel",
  component: SidePanel,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "SidePanel is a context-driven slide-in panel used for contextual actions and forms. " +
          "It is controlled via the `useSidePanel` hook, which requires `SidePanelContextProvider` " +
          "to be present higher in the tree. The panel supports four sizes (narrow, regular, wide, large) " +
          "and automatically closes on route changes or when the Escape key is pressed.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <SidePanelContextProvider>
          <div className="l-application" style={{ minHeight: "400px" }}>
            <Story />
          </div>
        </SidePanelContextProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SidePanel>;

export const Interactive: Story = {
  render: () => (
    <>
      <div className="l-main" style={{ padding: "1rem" }}>
        <TogglePanelButton title="Edit resource" />
      </div>
      <SidePanel />
    </>
  ),
};

export const Default: Story = {
  render: () => (
    <>
      <SidePanel />
      <AutoOpenPanel title="Panel title" />
    </>
  ),
};

export const NarrowSize: Story = {
  render: () => (
    <>
      <SidePanel />
      <AutoOpenPanel size="narrow" title="Narrow panel" />
    </>
  ),
};

export const WideSize: Story = {
  render: () => (
    <>
      <SidePanel />
      <AutoOpenPanel size="wide" title="Wide panel" />
    </>
  ),
};

export const LargeSize: Story = {
  render: () => (
    <>
      <SidePanel />
      <AutoOpenPanel size="large" title="Large panel" />
    </>
  ),
};
