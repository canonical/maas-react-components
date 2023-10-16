import { AriaAttributes, PropsWithChildren } from "react";
import "./NestedFormGroup.scss";

export const NestedFormGroup = ({
  children,
  ...props
}: PropsWithChildren & Pick<AriaAttributes, "aria-hidden">) => (
  <div className="p-form__nested-group" {...props}>
    {children}
  </div>
);
