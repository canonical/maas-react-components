import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Link> = {
  title: "Sections/Navigation/Link",
  component: Navigation.Link,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            <Navigation.Item>
              <Navigation.Link {...args} />
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
export const Example = { args: { to: "#", current: "page", children: (
  <>
    <Navigation.Icon name="code" />
    <Navigation.Label>Settings</Navigation.Label>
  </>
)}};