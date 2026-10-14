import { useState } from "react";

import { Meta } from "@storybook/react-vite";

import { Navigation } from "@/lib/sections/Navigation/Navigation";
import { NavigationGroupProps } from "@/lib/sections/Navigation/Group/Group";

const Template = (args: NavigationGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(args.isExpanded);
  return (
    <Navigation.Group {...args} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
  );
};

const meta: Meta<typeof Navigation.Group> = {
  title: "Sections/Navigation/Group",
  component: Navigation.Group,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Content>
          <Navigation.List>
            <Template {...args} />
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

export const Example = {
  args: {
    icon: "machines",
    isExpanded: true,
    label: "Hardware",
    children: (
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
    ),
  },
};

export const Collapsed = {
  args: {
    ...Example.args,
    isExpanded: false,
  },
};

export const WithoutIcon = {
  args: {
    ...Example.args,
    icon: undefined,
  },
};
