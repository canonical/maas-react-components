import { AriaAttributes, Dispatch, SetStateAction, useState } from "react";

import { Input } from "@canonical/react-components";
import type { Meta } from "@storybook/react";

import { NestedFormGroup } from ".";

const Template = ({
  isChecked,
  setIsChecked,
  "aria-hidden": ariaHidden,
}: {
  isChecked?: boolean;
  setIsChecked?: Dispatch<SetStateAction<boolean>>;
} & Pick<AriaAttributes, "aria-hidden">) => {
  return (
    <>
      <Input
        label="Secure erase feature of the disks"
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked?.(!isChecked)}
      />
      <NestedFormGroup
        aria-hidden={typeof isChecked === "boolean" ? !isChecked : ariaHidden}
      >
        <Input
          label="Slow (secure, writing null bytes to the whole disk)"
          type="radio"
        />
        <Input label="Quick (not secure, using wipefs)" type="radio" />
      </NestedFormGroup>
    </>
  );
};

const ControlledTemplate = () => {
  const [isChecked, setIsChecked] = useState(false);
  return <Template isChecked={isChecked} setIsChecked={setIsChecked} />;
};

const meta: Meta<typeof NestedFormGroup> = {
  title: "Components/NestedFormGroup",
  component: NestedFormGroup,
  render: (args) => (
    <NestedFormGroup aria-hidden={args["aria-hidden"]}>
      <Input
        label="Slow (secure, writing null bytes to the whole disk)"
        type="radio"
      />
      <Input label="Quick (not secure, using wipefs)" type="radio" />
    </NestedFormGroup>
  ),
  tags: ["autodocs"],
  parameters: {
    status: {
      type: "candidate",
      url: "https://github.com/canonical/vanilla-framework/issues/4893",
    },
  },
};
export default meta;

export const Example = { args: { "aria-hidden": false } };
export const ControlledExample = {
  render: ControlledTemplate,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
};
