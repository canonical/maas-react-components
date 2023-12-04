import type { Meta } from "@storybook/react";

import { FormSection } from ".";

import { Example as InputGroupExample } from "@/lib/sections/InputGroup/InputGroup.stories";

export const Example = ({
  children,
}: {
  label?: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <FormSection>
    <FormSection.Title>Form section title</FormSection.Title>
    <FormSection.Description>Form section description</FormSection.Description>
    <FormSection.Content>{children}</FormSection.Content>
  </FormSection>
);

const meta: Meta<typeof FormSection> = {
  title: "Components/FormSection",
  component: FormSection,
  tags: ["autodocs"],
  parameters: {},
};
export default meta;

export const WithInputGroup = {
  render: () => (
    <Example>
      <InputGroupExample />
    </Example>
  ),
};
