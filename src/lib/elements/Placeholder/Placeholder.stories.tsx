// noinspection JSUnusedGlobalSymbols -- Storybook story exports are consumed by
// the Storybook runtime, not by TypeScript imports. The IDE cannot see that usage.
import { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/lib/elements/Placeholder/Placeholder";

const meta: Meta<typeof Placeholder> = {
  title: "elements/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
    docs: {
      description: {
        component:
          "Placeholder is a pulsing skeleton block used to represent content that is still loading. " +
          "Pass `width` and `height` to size the block explicitly, or compose multiple instances " +
          "to mirror the layout of the real content. The legacy `isPending`/`text`/`children` API " +
          "is still supported but deprecated — prefer conditional rendering at the call-site instead.",
      },
    },
  },
  args: {
    variant: "block",
  },
  argTypes: {
    // Dimensions
    width: {
      description:
        'Width of the skeleton block. Accepts any valid CSS value (e.g. "200px", "100%", "12rem"). ' +
        "When omitted the block stretches to fill its container.",
      control: { type: "text" },
      table: {
        type: { summary: 'CSSProperties["width"]' },
        category: "Dimensions",
      },
    },
    height: {
      description:
        'Height of the skeleton block. Accepts any valid CSS value (e.g. "1rem", "48px", "3em"). ' +
        "When omitted the block collapses unless a sizer or explicit content provides height.",
      control: { type: "text" },
      table: {
        type: { summary: 'CSSProperties["height"]' },
        category: "Dimensions",
      },
    },

    // Appearance
    variant: {
      description:
        'Rendering variant. `"block"` renders a standalone skeleton div sized by `width` and `height`. ' +
        '`"text"` is the legacy variant that requires `isPending` to control visibility.',
      control: { type: "radio" },
      options: ["block", "text"],
      table: {
        type: { summary: '"block" | "text"' },
        defaultValue: { summary: '"text"' },
        category: "Appearance",
      },
    },
    className: {
      description: "Additional CSS class names applied to the root element.",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        category: "Appearance",
      },
    },

    // Deprecated
    isPending: {
      description:
        "**Deprecated.** Use conditional rendering at the call-site instead. " +
        "When `true` the skeleton is shown; when `false` the `children` are rendered. " +
        "Will be removed in a future major version.",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        category: "Deprecated",
      },
    },
    text: {
      description:
        "**Deprecated.** Width is now controlled via the `width` prop. " +
        "When provided the text is rendered inside a visually-hidden sizer span " +
        "that gives the block its natural content width. Will be removed in a future major version.",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
        category: "Deprecated",
      },
    },
    children: {
      description:
        "**Deprecated.** Pass children outside the Placeholder and control visibility at the call-site. " +
        "Will be removed in a future major version.",
      control: false,
      table: {
        type: { summary: "ReactNode" },
        category: "Deprecated",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const TextLine: Story = {
  args: {
    width: "200px",
    height: "1rem",
  },
};

export const Paragraph: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Placeholder width="100%" height="1rem" variant="block" />
      <Placeholder width="100%" height="1rem" variant="block" />
      <Placeholder width="60%" height="1rem" variant="block" />
    </div>
  ),
};

export const Block: Story = {
  args: {
    width: "3rem",
    height: "3rem",
  },
};

export const Complex: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <Placeholder width="3rem" height="3rem" variant="block" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
        }}
      >
        <Placeholder width="40%" height="1rem" variant="block" />
        <Placeholder width="100%" height="0.875rem" variant="block" />
        <Placeholder width="80%" height="0.875rem" variant="block" />
      </div>
    </div>
  ),
};

export const LegacyTextProp: Story = {
  name: "Legacy (text prop)",
  args: {
    variant: "text",
    isPending: true,
    text: "XXXxxxx.xxxxxxxxx",
  },
};

export const LegacyChildrenProp: Story = {
  name: "Legacy (children prop)",
  args: {
    variant: "text",
    isPending: true,
    children: <span>XXXxxxx.xxxxxxxxx</span>,
  },
};
