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
            <Navigation.Item {...args}/>
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
), hasActiveChild: false }};

export const GroupExample = { args: { children: (
  <>
    <Navigation.Text>
      <Navigation.Icon name="machines"/>
      <Navigation.Label variant="group">Hardware</Navigation.Label>
    </Navigation.Text>
    <Navigation.List>
      <Navigation.Item>
        <Navigation.Link href="#" aria-current="page">
          <Navigation.Label>Machines</Navigation.Label>
        </Navigation.Link>
        <Navigation.Link href="#">
          <Navigation.Label>Controllers</Navigation.Label>
        </Navigation.Link>
        <Navigation.Link href="#">
          <Navigation.Label>Devices</Navigation.Label>
        </Navigation.Link>
      </Navigation.Item>
    </Navigation.List>
  </>
), hasActiveChild: true }}