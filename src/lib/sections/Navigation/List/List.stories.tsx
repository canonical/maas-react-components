import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.List> = {
  title: "Sections/Navigation/List",
  component: Navigation.List,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            {args["children"]}
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
  <>
    <Navigation.Item>
      <Navigation.Link href="#" aria-current="page">
        <Navigation.Icon name="code" />
        <Navigation.Label>Settings</Navigation.Label>
      </Navigation.Link>
    </Navigation.Item>
    <Navigation.Item>
      <Navigation.Link href="#">
        <Navigation.Icon name="user" />
        <Navigation.Label>Account</Navigation.Label>
      </Navigation.Link>
    </Navigation.Item>
  </>
)}};
