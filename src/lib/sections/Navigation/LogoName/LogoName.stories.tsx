import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.LogoName> = {
  title: "Sections/Navigation/Logo/LogoName",
  component: Navigation.LogoName,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Header>
          <Navigation.Banner>
            <Navigation.Logo>
              <Navigation.LogoName>
                {args["children"]}
              </Navigation.LogoName>
            </Navigation.Logo>
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