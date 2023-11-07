import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Label> = {
  title: "Sections/Navigation/Label",
  component: Navigation.Label,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            <Navigation.Item>
              <Navigation.Link href="#">
                <Navigation.Label {...args} />
              </Navigation.Link>
            </Navigation.Item>
          </Navigation.List>
        </Navigation.Content>
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
export const Example = { args: { children: "Settings", variant: "base" }};