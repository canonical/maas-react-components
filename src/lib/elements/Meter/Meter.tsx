import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";

import { useListener } from "@canonical/react-components";
import classNames from "classnames";
import "./Meter.scss";

export const meterColor = {
  caution: "#F99B11",
  light: "#F7F7F7",
  linkFaded: "#D3E4ED",
  link: "#0066CC",
  negative: "#C7162B",
  positiveFaded: "#B7CCB9",
  positiveMid: "#4DAB4D",
  positive: "#0E8420",
} as const;

export const defaultFilledColors = [
  meterColor.link,
  meterColor.positive,
  meterColor.negative,
  meterColor.caution,
];
const emptyColor = meterColor.linkFaded;
const overColor = meterColor.caution;
const separatorColor = meterColor.light;
const minimumSegmentWidth = 2;
const separatorWidth = 1;

const calculateWidths = (
  el: React.MutableRefObject<Element | null>,
  maximum: number,
) => {
  const boundingWidth = el?.current?.getBoundingClientRect()?.width || 0;
  const segmentWidth =
    boundingWidth > maximum * minimumSegmentWidth
      ? boundingWidth / maximum
      : minimumSegmentWidth;
  return segmentWidth;
};

type MeterDatum = {
  color?: string;
  value: number;
};

export interface MeterProps
  extends React.PropsWithChildren,
    React.ComponentProps<"div"> {
  className?: string;
  data: MeterDatum[];
  max?: number;
  variant?: "regular" | "segmented";
  size?: "regular" | "small";
}

export const testIds = {
  bar: "meter-bar",
  container: "meter-container",
  filled: "meter-filled",
  label: "meter-label",
  meteroverflow: "meter-overflow",
  segments: "meter-segments",
};

const Meter = ({
  className,
  children,
  data,
  max,
  variant = "regular",
  size = "regular",
  ...props
}: MeterProps) => {
  const el = useRef(null);
  const valueSum = data?.reduce((sum, datum) => sum + datum.value, 0);
  const maximum = max || valueSum;
  const datumWidths = data.map((datum) => (datum.value / maximum) * 100);
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    if (variant === "segmented") {
      setSegmentWidth(calculateWidths(el, maximum));
    } else {
      setSegmentWidth(0);
    }
  }, [maximum, variant]);

  const onResize = useCallback(() => {
    setSegmentWidth(calculateWidths(el, maximum));
  }, [el, maximum, setSegmentWidth]);

  useListener(window, onResize, "resize", true, variant === "segmented");

  return (
    <div
      className={classNames("p-meter", className, {
        "p-meter--small": size === "small",
      })}
      aria-label={props?.["aria-label"]}
      data-testid={testIds.container}
      ref={el}
    >
      <MeterBar>
        <MeterSegments
          {...{
            data,
            datumWidths,
            maximum,
            overColor,
            segmentWidth,
            separatorColor,
          }}
        />
      </MeterBar>
      {children}
    </div>
  );
};

const MeterBar = ({ children }: React.PropsWithChildren) => {
  return (
    <div
      className="p-meter__bar"
      data-testid={testIds.bar}
      style={{ backgroundColor: emptyColor }}
    >
      {children}
    </div>
  );
};

export interface MeterSegmentProps extends Omit<MeterProps, "children"> {
  datumWidths: number[];
  maximum: number;
  segmentWidth: number;
}
const MeterSegments = ({
  data,
  datumWidths,
  maximum,
  segmentWidth,
}: MeterSegmentProps) => {
  const isOverflowing = () =>
    data?.reduce((sum, datum) => sum + datum.value, 0) > maximum;

  const filledStyle = (datum: MeterDatum, i: number) => ({
    backgroundColor: datum.color,
    left: `${datumWidths?.reduce(
      (leftPos, width, j) => (i > j ? leftPos + width : leftPos),
      0,
    )}%`,
    width: `${datumWidths[i]}%`,
  });

  const separatorStyle = () => ({
    background: `repeating-linear-gradient(
      to right,
      transparent 0,
      transparent ${segmentWidth - separatorWidth}px,
      ${separatorColor} ${segmentWidth - separatorWidth}px,
      ${separatorColor} ${segmentWidth}px
    )`,
  });

  return (
    <>
      {isOverflowing() ? (
        <div
          className="p-meter__filled"
          data-testid={testIds.meteroverflow}
          style={{ backgroundColor: overColor, width: "100%" }}
        ></div>
      ) : (
        data?.map((datum, i) => (
          <div
            className="p-meter__filled"
            data-testid={testIds.filled}
            key={`meter-${i}`}
            style={filledStyle(datum, i)}
          ></div>
        ))
      )}
      {segmentWidth > 0 && (
        <div
          className="p-meter__separators"
          data-testid={testIds.segments}
          style={separatorStyle()}
        />
      )}
    </>
  );
};

const MeterLabel = ({
  className,
  children,
}: React.PropsWithChildren<Pick<MeterProps, "className">>) => {
  return (
    <div
      className={classNames("p-meter__label", className)}
      data-testid={testIds.label}
    >
      {children}
    </div>
  );
};

Meter.Label = MeterLabel;

export { Meter };
