import { ReactNode } from "react";

import classNames from "classnames";
import "./Stepper.scss";

type Props = {
  /**
   * A zero-based index of the currently active step
   */
  activeStep: number;
  /**
   * An array of strings representing individual steps
   */
  items: string[];
};

export const Stepper = ({ activeStep, items }: Props): ReactNode => {
  return (
    <ol className="stepper">
      {items.map((step, i) => {
        const isActive = i === activeStep;
        const isComplete = i < activeStep;
        return (
          <li aria-label={step} className="stepper__item" key={i}>
            <p
              aria-label={isComplete ? `${step} (completed)` : step}
              className={classNames("stepper__title", {
                "stepper__title--is-active": isActive,
                "stepper__title--is-complete": isComplete,
              })}
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
