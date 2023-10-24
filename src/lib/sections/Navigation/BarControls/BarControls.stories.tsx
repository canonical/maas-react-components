import { Meta } from "@storybook/react";

import { Navigation, NavigationBar } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Controls> = {
  title: "Sections/Navigation/Bar/Controls",
  component: Navigation.Controls,
  render: (args) => (
    <NavigationBar>
      <Navigation.Header>
        <NavigationBar.Controls>
          {args["children"]}
        </NavigationBar.Controls>
      </Navigation.Header>
    </NavigationBar>
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
  <NavigationBar.MenuButton onClick={() => {}}>
    Menu
  </NavigationBar.MenuButton>
)}}