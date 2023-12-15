import { Button } from "@canonical/react-components";
import { Meta } from "@storybook/react";

import { ContentSection } from "@/lib/sections/ContentSection/ContentSection";
import { WithInputGroup } from "@/lib/sections/FormSection/FormSection.stories";
import { Example as MainToolbarExample } from "@/lib/sections/MainToolbar/MainToolbar.stories";

const meta: Meta<typeof ContentSection> = {
  title: "sections/ContentSection",
  component: ContentSection,
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "text",
    },
    children: {
      control: {
        disable: true,
      },
    },
  },
  render: (args) => (
    // fixed height container to demonstrate sticky footer
    <div style={{ height: "250px", overflowY: "auto" }}>
      <ContentSection {...args} />
    </div>
  ),
};

export default meta;

export const Example = {
  args: {
    children: (
      <>
        <ContentSection.Title>Section Title</ContentSection.Title>
        <ContentSection.Content>Section Content</ContentSection.Content>
        <ContentSection.Footer>Section Footer</ContentSection.Footer>
      </>
    ),
  },
};

export const WithForm = {
  args: {
    children: (
      <>
        <ContentSection.Title>Section Title</ContentSection.Title>
        <ContentSection.Content>
          <WithInputGroup.render />
        </ContentSection.Content>
        <ContentSection.Footer>
          <Button appearance="positive">Submit</Button>
        </ContentSection.Footer>
      </>
    ),
    variant: "narrow",
  },
};

export const WithToolbar = {
  args: {
    children: (
      <>
        <ContentSection.Header>
          <MainToolbarExample.render />
        </ContentSection.Header>
        <ContentSection.Content>
          <WithInputGroup.render />
        </ContentSection.Content>
      </>
    ),
  },
};

export const WithNestedFooter = {
  args: {
    children: (
      <>
        <ContentSection.Header>
          <ContentSection.Title>Section Title</ContentSection.Title>
        </ContentSection.Header>
        <ContentSection.Content>
          Section Content
          <ContentSection.Footer>Section Footer</ContentSection.Footer>
        </ContentSection.Content>
      </>
    ),
  },
};
