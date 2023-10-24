import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Content> = {
  title: "Sections/Navigation/Content",
  component: Navigation.Content,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          {args["children"]}
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
  <Navigation.List>
    <Navigation.Item>
      <Navigation.Link to="#" current="page">
        <Navigation.Icon name="code" />
        <Navigation.Label>Settings</Navigation.Label>
      </Navigation.Link>
    </Navigation.Item>
    <Navigation.Item>
      <Navigation.Link to="#">
        <Navigation.Icon name="user" />
        <Navigation.Label>Account</Navigation.Label>
      </Navigation.Link>
    </Navigation.Item>
  </Navigation.List>
)}};
