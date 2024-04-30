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

  useEffect(() => {
    const inputWrapper = limitedInputRef.current?.firstElementChild;
    if (inputWrapper) {
      if (props.label) {
        // CSS variable "--immutable" is the content of the :before element, which shows the immutable octets
        // "--top" is the `top` property of the :before element, which is adjusted if there is a label to prevent overlap
        inputWrapper.setAttribute(
          "style",
          `--top: 2.5rem; --immutable: "${immutableText}"`,
        );
      } else {
        inputWrapper.setAttribute("style", `--immutable: "${immutableText}"`);
      }

      const width = window.getComputedStyle(inputWrapper, ":before").width;

      // Adjust the left padding of the input to be the same width as the immutable octets.
      // This displays the user input and the unchangeable text together as one IP address.
      inputWrapper.lastElementChild?.firstElementChild?.setAttribute(
        "style",
        `padding-left: ${width}`,
      );
    }
  }, [limitedInputRef, immutableText, props.label]);

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
