import { formatBytes } from "./formatBytes";

it("correctly formats a value above the unit threshold", () => {
  expect(formatBytes({ value: 900, unit: "KB" })).toStrictEqual({
    value: 900,
    unit: "KB",
  });
  expect(formatBytes({ value: 1100, unit: "KB" })).toStrictEqual({
    value: 1.1,
    unit: "MB",
  });
});

it("correctly formats a value below the unit threshold", () => {
  expect(formatBytes({ value: 1, unit: "MB" })).toStrictEqual({
    value: 1,
    unit: "MB",
  });
  expect(formatBytes({ value: 0.1, unit: "MB" })).toStrictEqual({
    value: 100,
    unit: "KB",
  });
});

it("rounds the value to 2 decimal places by default", () => {
  expect(formatBytes({ value: 1234, unit: "B" })).toStrictEqual({
    value: 1.23,
    unit: "KB",
  });
  expect(formatBytes({ value: 1236, unit: "B" })).toStrictEqual({
    value: 1.24,
    unit: "KB",
  });
});

it("can round to different decimal places", () => {
  expect(
    formatBytes({ value: 1234, unit: "B" }, { decimals: 0 }),
  ).toStrictEqual({
    value: 1,
    unit: "KB",
  });
  expect(
    formatBytes({ value: 1234, unit: "B" }, { decimals: 1 }),
  ).toStrictEqual({
    value: 1.2,
    unit: "KB",
  });
  expect(
    formatBytes({ value: 1234, unit: "B" }, { decimals: 2 }),
  ).toStrictEqual({
    value: 1.23,
    unit: "KB",
  });
  expect(
    formatBytes({ value: 1234, unit: "B" }, { decimals: 3 }),
  ).toStrictEqual({
    value: 1.234,
    unit: "KB",
  });
});

it("can be forced to round result down", () => {
  expect(
    formatBytes({ value: 1236, unit: "B" }, { roundFunc: "floor" }),
  ).toStrictEqual({
    value: 1.23,
    unit: "KB",
  });
});

it("can be forced to round result up", () => {
  expect(
    formatBytes({ value: 1234, unit: "B" }, { roundFunc: "ceil" }),
  ).toStrictEqual({
    value: 1.24,
    unit: "KB",
  });
});

it("can handle binary units", () => {
  expect(formatBytes({ value: 0, unit: "B" }, { binary: true })).toStrictEqual({
    value: 0,
    unit: "B",
  });
  expect(
    formatBytes({ value: 1023, unit: "MiB" }, { binary: true }),
  ).toStrictEqual({
    value: 1023,
    unit: "MiB",
  });
  expect(
    formatBytes({ value: 1024, unit: "MiB" }, { binary: true }),
  ).toStrictEqual({
    value: 1,
    unit: "GiB",
  });
});

it("can handle negative numbers", () => {
  expect(formatBytes({ value: -1, unit: "B" })).toStrictEqual({
    value: -1,
    unit: "B",
  });
  expect(formatBytes({ value: -2000, unit: "MB" })).toStrictEqual({
    value: -2,
    unit: "GB",
  });
  expect(
    formatBytes({ value: -1234, unit: "GB" }, { decimals: 3 }),
  ).toStrictEqual({
    value: -1.234,
    unit: "TB",
  });
  expect(
    formatBytes({ value: -1024, unit: "MiB" }, { binary: true }),
  ).toStrictEqual({
    value: -1,
    unit: "GiB",
  });
});

it("can convert to a specific unit", () => {
  expect(
    formatBytes({ value: 1000000, unit: "B" }, { convertTo: "B" }),
  ).toStrictEqual({
    value: 1000000,
    unit: "B",
  });
  expect(
    formatBytes({ value: 1000000, unit: "B" }, { convertTo: "KB" }),
  ).toStrictEqual({
    value: 1000,
    unit: "KB",
  });
  expect(
    formatBytes({ value: 1000000, unit: "B" }, { convertTo: "MB" }),
  ).toStrictEqual({
    value: 1,
    unit: "MB",
  });
  expect(
    formatBytes(
      { value: 1000000, unit: "B" },
      { convertTo: "GB", decimals: 3 },
    ),
  ).toStrictEqual({
    value: 0.001,
    unit: "GB",
  });
  expect(
    formatBytes(
      { value: 1000000, unit: "B" },
      { convertTo: "TB", decimals: 6 },
    ),
  ).toStrictEqual({
    value: 0.000001,
    unit: "TB",
  });
});
