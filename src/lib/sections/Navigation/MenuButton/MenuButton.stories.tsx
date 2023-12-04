import { Meta } from "@storybook/react";

import { Navigation, NavigationBar } from "@/lib/sections/Navigation";

const meta: Meta<typeof NavigationBar.MenuButton> = {
  title: "Sections/Navigation/Bar/MenuButton",
  component: NavigationBar.MenuButton,
  render: (args) => (
    <NavigationBar>
      <Navigation.Header>
        <Navigation.Controls>
          <NavigationBar.MenuButton {...args} />
        </Navigation.Controls>
      </Navigation.Header>
    </NavigationBar>
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
}

export default meta;
export const Example = { args: { children: "Menu", onClick: () => {} }};
