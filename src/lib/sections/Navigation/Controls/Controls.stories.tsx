import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Controls> = {
  title: "Sections/Navigation/Controls",
  component: Navigation.Controls,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Header>
          <Navigation.Banner>
            <Navigation.Controls>
              {args["children"]}          
            </Navigation.Controls>
          </Navigation.Banner>
        </Navigation.Header>
      </Navigation.Drawer>
    </Navigation>
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;
export const Example = { args: { children: (
  <Navigation.CollapseToggle isCollapsed={false} setIsCollapsed={() => {}} />
)}}