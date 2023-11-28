import { Button, SearchBox, Select } from "@canonical/react-components";
import { Meta } from "@storybook/react";

import { MainToolbar } from "@/lib/sections/MainToolbar/MainToolbar";

const meta: Meta<typeof MainToolbar> = {
  title: "sections/MainToolbar",
  component: MainToolbar,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
    },
  },
  argTypes: {
    children: {
      control: false,
    },
  },
};

export default meta;

export const Example = {
  render: () => (
    <MainToolbar>
      <MainToolbar.Title>Toolbar title</MainToolbar.Title>
      <MainToolbar.Controls>
        <Select
          options={[
            {
              value: "",
              label: "Filters",
            },
          ]}
        />
        <SearchBox value="" />
        <Select
          options={[
            {
              value: "",
              label: "No grouping",
            },
          ]}
        />
        <Button appearance="positive">Take action</Button>
      </MainToolbar.Controls>
    </MainToolbar>
  ),
};
