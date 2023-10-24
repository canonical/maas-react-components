import { Meta } from "@storybook/react";

import { Navigation, NavigationBar } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof NavigationBar.LogoName> = {
  title: "Sections/Navigation/Bar/LogoName",
  component: NavigationBar.LogoName,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Header>
          <Navigation.Banner>
            <NavigationBar.Logo>
              <NavigationBar.LogoName>
                {args["children"]}
              </NavigationBar.LogoName>
            </NavigationBar.Logo>
          </Navigation.Banner>
        </Navigation.Header>
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
export const Example = { args: { children: "MAAS" }}