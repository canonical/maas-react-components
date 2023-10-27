import { Meta } from "@storybook/react";

import { Navigation, NavigationBar } from "./Navigation";

const meta: Meta<typeof Navigation> = {
  title: "Sections/Navigation",
  component: Navigation,
  render: (args) => (
    <div className="l-application">
      <NavigationBar>
        <Navigation.Header>
          <Navigation.Banner>
            <Navigation.Logo>
              <Navigation.LogoTag>
                <Navigation.LogoIcon
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
                </Navigation.LogoIcon>
              </Navigation.LogoTag>
              <Navigation.LogoName>
                MAAS
              </Navigation.LogoName>
            </Navigation.Logo>
          </Navigation.Banner>
          <Navigation.Controls>
            <NavigationBar.MenuButton onClick={() => {}} >
              Menu
            </NavigationBar.MenuButton>
          </Navigation.Controls>
        </Navigation.Header>
      </NavigationBar>

      <Navigation isCollapsed={args["isCollapsed"]}>
        <Navigation.Drawer>
          <Navigation.Header>
            <Navigation.Banner>
              <Navigation.Logo>
                <Navigation.LogoTag>
                  <Navigation.LogoIcon
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
                  </Navigation.LogoIcon>
                </Navigation.LogoTag>
                <Navigation.LogoName>
                  MAAS
                </Navigation.LogoName>
              </Navigation.Logo>
              <Navigation.Controls>
                <Navigation.CollapseToggle isCollapsed={args["isCollapsed"]} setIsCollapsed={() => {}} />
              </Navigation.Controls>
            </Navigation.Banner>
          </Navigation.Header>
          <Navigation.Content>
            <Navigation.List>
              <Navigation.Item hasActiveChild>
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
              </Navigation.Item>
              <Navigation.Item>
                <Navigation.Text>
                  <Navigation.Icon name="pods"/>
                  <Navigation.Label variant="group">KVM</Navigation.Label>
                </Navigation.Text>
                <Navigation.List>
                  <Navigation.Item>
                    <Navigation.Link href="#">
                      <Navigation.Label>LXD</Navigation.Label>
                    </Navigation.Link>
                  </Navigation.Item>
                </Navigation.List>
              </Navigation.Item>
              <Navigation.Item>
                <Navigation.Text>
                  <Navigation.Icon name="tag"/>
                  <Navigation.Label variant="group">Organisation</Navigation.Label>
                </Navigation.Text>
                <Navigation.List>
                  <Navigation.Item>
                    <Navigation.Link href="#">
                      <Navigation.Label>Tags</Navigation.Label>
                    </Navigation.Link>
                    <Navigation.Link href="#">
                      <Navigation.Label>AZs</Navigation.Label>
                    </Navigation.Link>
                    <Navigation.Link href="#">
                      <Navigation.Label>Pools</Navigation.Label>
                    </Navigation.Link>
                  </Navigation.Item>
                </Navigation.List>
              </Navigation.Item>
              <Navigation.Item>
                <Navigation.Text>
                  <Navigation.Icon name="units"/>
                  <Navigation.Label variant="group">Configuration</Navigation.Label>
                </Navigation.Text>
                <Navigation.List>
                  <Navigation.Item>
                    <Navigation.Link href="#">
                      <Navigation.Label>Images</Navigation.Label>
                    </Navigation.Link>
                  </Navigation.Item>
                </Navigation.List>
              </Navigation.Item>
              <Navigation.Item>
                <Navigation.Text>
                  <Navigation.Icon name="connected"/>
                  <Navigation.Label variant="group">Networking</Navigation.Label>
                </Navigation.Text>
                <Navigation.List>
                  <Navigation.Item>
                    <Navigation.Link href="#">
                      <Navigation.Label>Subnets</Navigation.Label>
                    </Navigation.Link>
                    <Navigation.Link href="#">
                      <Navigation.Label>DNS</Navigation.Label>
                    </Navigation.Link>
                    <Navigation.Link href="#">
                      <Navigation.Label>Discovery</Navigation.Label>
                    </Navigation.Link>
                  </Navigation.Item>
                </Navigation.List>
              </Navigation.Item>
            </Navigation.List>
            <Navigation.List>
              <Navigation.Item>
                <Navigation.Link href="#">
                  <Navigation.Icon name="settings" />
                  <Navigation.Label>Settings</Navigation.Label>
                </Navigation.Link>
              </Navigation.Item>
            </Navigation.List>
            <Navigation.List>
              <Navigation.Item>
                <Navigation.Link href="#">
                  <Navigation.Icon name="profile" />
                  <Navigation.Label>admin</Navigation.Label>
                </Navigation.Link>
              </Navigation.Item>
              <Navigation.Item>
                <Navigation.Link as="button">
                  <Navigation.Label>Log out</Navigation.Label>
                </Navigation.Link>
              </Navigation.Item>
            </Navigation.List>
          </Navigation.Content>
        </Navigation.Drawer>
      </Navigation>
    </div>
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
};

export default meta;
export const Example = { args: { isCollapsed: false }};