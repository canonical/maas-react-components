import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Footer> = {
  title: "Sections/Navigation/Footer",
  component: Navigation.Footer,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Footer>{args["children"]}</Navigation.Footer>
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
export const Example = {
  args: {
    children: (
      <Navigation.Content>
        <Navigation.List>
          <Navigation.Item>
            <Navigation.Link href="#">
              <Navigation.Icon name="information" />
              <Navigation.Label>Documentation</Navigation.Label>
            </Navigation.Link>
          </Navigation.Item>
          <Navigation.Item>
            <Navigation.Link href="#">
              <Navigation.Icon name="user" />
              <Navigation.Label>Community</Navigation.Label>
            </Navigation.Link>
          </Navigation.Item>
          <Navigation.Item>
            <Navigation.Link href="#">
              <Navigation.Icon name="help" />
              <Navigation.Label>Report a bug</Navigation.Label>
            </Navigation.Link>
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Content>
    ),
  },
};
