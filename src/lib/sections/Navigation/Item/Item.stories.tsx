import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Item> = {
  title: "Sections/Navigation/Item",
  component: Navigation.Item,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            <Navigation.Item>
              {args["children"]}
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
export const Example = { args: { children: (
  <Navigation.Link href="#">
    <Navigation.Icon name="code" />
    <Navigation.Label>Settings</Navigation.Label>
  </Navigation.Link>
)}};