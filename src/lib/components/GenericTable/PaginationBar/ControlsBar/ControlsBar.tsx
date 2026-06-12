import type { PropsWithChildren, ReactElement } from "react";

type ControlsBarProps = PropsWithChildren<{ "aria-label"?: string }>;

const ControlsBar = ({
  children,
  "aria-label": ariaLabel = "Table controls",
}: ControlsBarProps): ReactElement => {
  return (
    <section
      aria-label={ariaLabel}
      className="controls-bar u-flex u-flex--justify-between u-flex--wrap"
    >
      <div className="p-form p-form--inline">{children}</div>
    </section>
  );
};

const ControlsBarLeft = ({ children }: PropsWithChildren<object>) => {
  return <strong className="controls-bar__description">{children}</strong>;
};

const ControlsBarRight = ({ children }: PropsWithChildren<object>) => {
  return (
    <div className="u-flex u-flex--wrap u-flex--column-x-small controls-bar__right">
      {children}
    </div>
  );
};

ControlsBar.Left = ControlsBarLeft;
ControlsBar.Right = ControlsBarRight;

export default ControlsBar;
