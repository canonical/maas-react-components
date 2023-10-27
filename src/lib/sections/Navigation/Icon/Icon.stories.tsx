import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Icon> = {
  title: "Sections/Navigation/Icon",
  component: Navigation.Icon,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            <Navigation.Item>
              <Navigation.Link href="#">
                <Navigation.Icon {...args} />
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
export const Example = { args: { name: "code" }};