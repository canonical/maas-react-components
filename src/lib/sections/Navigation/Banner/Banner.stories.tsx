import { Meta } from "@storybook/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

const meta: Meta<typeof Navigation.Banner> = {
  title: "Sections/Navigation/Banner",
  component: Navigation.Banner,
  render: (args) => (
    <Navigation isCollapsed={false}>
      <Navigation.Drawer>
        <Navigation.Header>
          <Navigation.Banner>
            {args["children"]}
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
export const Example = { args: { children: (
  <Navigation.Logo>
    <Navigation.LogoTag>
      <Navigation.LogoIcon>
        <svg
          fill="#fff"
          viewBox="0 0 165.5 174.3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="15.57" cy="111.46" rx="13.44" ry="13.3" />
          <path d="M156.94 101.45H31.88a18.91 18.91 0 0 1 .27 19.55c-.09.16-.2.31-.29.46h125.08a6 6 0 0 0 6.06-5.96v-8.06a6 6 0 0 0-6-6Z" />
          <ellipse cx="15.62" cy="63.98" rx="13.44" ry="13.3" />
          <path d="M156.94 53.77H31.79a18.94 18.94 0 0 1 .42 19.75l-.16.24h124.89a6 6 0 0 0 6.06-5.94v-8.06a6 6 0 0 0-6-6Z" />
          <ellipse cx="16.79" cy="16.5" rx="13.44" ry="13.3" />
          <path d="M156.94 6.5H33.1a19.15 19.15 0 0 1 2.21 5.11A18.82 18.82 0 0 1 33.42 26l-.29.46h123.81a6 6 0 0 0 6.06-5.9V12.5a6 6 0 0 0-6-6Z" />
          <ellipse cx="15.57" cy="158.94" rx="13.44" ry="13.3" />
          <path d="M156.94 149H31.88a18.88 18.88 0 0 1 .27 19.5c-.09.16-.19.31-.29.46h125.08A6 6 0 0 0 163 163v-8.06a6 6 0 0 0-6-6Z" />
        </svg>
      </Navigation.LogoIcon>
    </Navigation.LogoTag>
    <Navigation.LogoText>
      <Navigation.LogoName variant="small">Canonical</Navigation.LogoName>
      <Navigation.LogoName>MAAS</Navigation.LogoName>
    </Navigation.LogoText>
  </Navigation.Logo>
)}};
