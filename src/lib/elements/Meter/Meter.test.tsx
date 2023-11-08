import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Meter, meterColor, testIds } from "./Meter";

const mockClientRect = ({
  bottom = 0,
  height = 0,
  left = 0,
  right = 0,
  toJSON = () => undefined,
  top = 0,
  width = 0,
  x = 0,
  y = 0,
}) =>
  vi.fn(() => {
    return {
      bottom,
      height,
      left,
      right,
      toJSON,
      top,
      width,
      x,
      y,
    };
  });

it("can be made small", async () => {
  render(<Meter data={[]} size="small" />);

  expect(screen.getByTestId(testIds.container)).toHaveClass("p-meter--small");
});

it("can be given a label", () => {
  render(
    <Meter data={[{ value: 1 }, { value: 3 }]}>
      <Meter.Label>Meter label</Meter.Label>
    </Meter>,
  );

  expect(screen.getByTestId(testIds.label).textContent).toBe("Meter label");
});

it("can be given custom bar colours", () => {
  render(
    <Meter
      data={[
        { color: "#AAA", value: 1 },
        { color: "#BBB", value: 2 },
        { color: "#CCC", value: 3 },
      ]}
    />,
  );
  const segments = screen.getAllByTestId(testIds.filled);

  expect(segments[0]).toHaveStyle({ backgroundColor: "#AAA" });
  expect(segments[1]).toHaveStyle({ backgroundColor: "#BBB" });
  expect(segments[2]).toHaveStyle({ backgroundColor: "#CCC" });
});

it("changes colour if values exceed given maximum value", () => {
  render(<Meter data={[{ color: "#ABC", value: 100 }]} max={10} />);

  expect(screen.getByTestId(testIds.meteroverflow)).toHaveStyle({
    backgroundColor: meterColor.caution,
  });
});

it("correctly calculates datum widths", () => {
  render(
    <Meter
      data={[
        { value: 10 }, // 10/100 = 10%
        { value: 20 }, // 20/100 = 20%
        { value: 30 }, // 30/100 = 30%
        { value: 40 }, // 40/100 = 40%
      ]}
    />,
  );
  const segments = screen.getAllByTestId(testIds.filled);

  expect(segments[0]).toHaveStyle({ width: "10%" });
  expect(segments[1]).toHaveStyle({ width: "20%" });
  expect(segments[2]).toHaveStyle({ width: "30%" });
  expect(segments[3]).toHaveStyle({ width: "40%" });
});

it("correctly calculates datum positions", () => {
  render(
    <Meter
      data={[
        { value: 10 }, // 1st = 0%
        { value: 20 }, // 2nd = 1st width = 10%
        { value: 30 }, // 3rd = 1st + 2nd width = 30%
        { value: 40 }, // 4th = 1st + 2nd + 3rd width = 60%
      ]}
    />,
  );
  const segments = screen.getAllByTestId(testIds.filled);

  expect(segments[0]).toHaveStyle({ left: "0%" });
  expect(segments[1]).toHaveStyle({ left: "10%" });
  expect(segments[2]).toHaveStyle({ left: "30%" });
  expect(segments[3]).toHaveStyle({ left: "60%" });
});

it("can be made segmented", () => {
  render(<Meter data={[{ value: 2 }]} max={10} variant="segmented" />);

  expect(screen.getByTestId(testIds.segments)).toBeInTheDocument();
});

it("sets segment width to 1px if not enough space to show all segments", () => {
  // Make width 128px so max number of segments is 64 (1px segment, 1px separator)
  Element.prototype.getBoundingClientRect = mockClientRect({
    width: 128,
  });
  render(<Meter data={[{ value: 10 }]} max={100} variant="segmented" />);

  expect(screen.getByTestId(testIds.segments)).toHaveStyle({
    background: `repeating-linear-gradient(to right, transparent 0, transparent 1px, ${meterColor.light} 1px, ${meterColor.light} 2px );`,
  });
});
