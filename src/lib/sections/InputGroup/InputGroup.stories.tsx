import { Input } from "@canonical/react-components";
import type { Meta } from "@storybook/react";

import { InputGroup } from ".";

import { Example as FormSectionExample } from "@/lib/sections/FormSection/FormSection.stories";

export const Example = () => (
  <InputGroup>
    <InputGroup.Label>Input group label</InputGroup.Label>
    <InputGroup.Description>Input group description</InputGroup.Description>
    <Input label="Input label" type="radio" />
    <Input label="Input label" type="radio" />
  </InputGroup>
);

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
      url: "https://github.com/canonical/vanilla-framework/issues/4893",
    },
  },
};
export default meta;

export const InFormSection = {
  render: () => (
    <FormSectionExample>
      <InputGroup>
        <InputGroup.Label>Input group label</InputGroup.Label>
        <InputGroup.Description>Input group description</InputGroup.Description>
        <Input label="Input label" type="radio" />
        <Input label="Input label" type="radio" />
      </InputGroup>
    </FormSectionExample>
  ),
};
