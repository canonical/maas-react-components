import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.CollapseToggle> = {
  title: "Sections/Navigation/CollapseToggle",
  component: Navigation.CollapseToggle,
  render: (args) => (
    <Navigation.Drawer>
      <Navigation.Header>
        <Navigation.Banner>
          <Navigation.Controls>
            <Navigation.CollapseToggle {...args} />
          </Navigation.Controls>
        </Navigation.Banner>
      </Navigation.Header>
    </Navigation.Drawer>
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
}

export default meta;
export const Example = { args: { isCollapsed: false, setIsCollapsed: () => {} }}