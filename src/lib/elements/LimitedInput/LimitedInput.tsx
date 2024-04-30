import { RefObject, useEffect, useRef } from "react";

import { Input, InputProps } from "@canonical/react-components";
import "./LimitedInput.scss";
import classNames from "classnames";

export type LimitedInputProps = Omit<InputProps, "type"> & {
  immutableText: string;
};

/**
 * An input component with a fixed prefix that cannot be edited.
 *
 * @param immutableText The prefixed text that cannot be edited.
 * @returns A LimitedInput component.
 */
export const LimitedInput = ({
  immutableText,
  ...props
}: LimitedInputProps) => {
  const limitedInputRef: RefObject<HTMLDivElement> = useRef(null);

  const inputWrapper = limitedInputRef.current?.firstElementChild;

  useEffect(() => {
    if (inputWrapper) {
      console.log("AHAHAHAHAHHA");
      if (props.label) {
        inputWrapper.setAttribute(
          "style",
          `--top: 2.5rem; --immutable: "${immutableText}"`,
        );
      } else {
        inputWrapper.setAttribute("style", `--immutable: "${immutableText}"`);
      }

      const width = window.getComputedStyle(inputWrapper, ":before").width;

      inputWrapper.lastElementChild?.firstElementChild?.setAttribute(
        "style",
        `padding-left: ${width}`,
      );
    }
  }, [inputWrapper]);

  return (
    <div className="limited-input" ref={limitedInputRef}>
      <Input
        className={classNames("limited-input__input", props.className)}
        type="text"
        wrapperClassName={classNames(
          "limited-input__wrapper",
          props.wrapperClassName,
        )}
        {...props}
      />
    </div>
  );
};
