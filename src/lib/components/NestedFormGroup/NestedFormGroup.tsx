import { AriaAttributes, PropsWithChildren } from "react";

import "./NestedFormGroup.scss";
import { FadeInDown } from "@/lib/components/FadeInDown";

export const NestedFormGroup = ({
  children,
  ...props
}: PropsWithChildren & Pick<AriaAttributes, "aria-hidden">) => (
  <FadeInDown isVisible={!props["aria-hidden"]}>
    <div className="p-form__nested-group" {...props}>
      {children}
    </div>
  </FadeInDown>
);
