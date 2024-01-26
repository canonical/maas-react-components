type Byte = { value: number; unit: string };

interface FormatBytesConfig {
  binary?: boolean;
  convertTo?: string;
  decimals?: number;
  roundFunc?: "ceil" | "floor" | "round";
}

/**
 * Format bytes to the appropriate/supplied unit at supplied precision.
 *
 * @param value - the value in the supplied byte unit
 * @param unit - the byte unit, e.g. "KB", "TB"
 * @param binary - whether formatting should be done in base 10 or 2
 * @param convertTo - the unit to convert to
 * @param decimals - the decimal places to show, if not a whole number
 * @param roundFunc - whether to round the value up or down
 * @returns formatted value and byte unit object
 */
export const formatBytes = (
  { value, unit }: Byte,
  {
    binary = false,
    convertTo,
    decimals = 2,
    roundFunc = "round",
  }: FormatBytesConfig = {},
): Byte => {
  const negative = value < 0;
  const parsedValue = Math.abs(value);
  if (parsedValue === 0) {
    return { value: 0, unit: convertTo || "B" };
  }
  const k = binary ? 1024 : 1000;
  const sizes = binary
    ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    : ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Convert to bytes.
  const i = sizes.findIndex((size) => size === unit) || 0;
  const valueInBytes = parsedValue * Math.pow(k, i);

  // Convert to appropriate unit.
  const j = convertTo
    ? sizes.findIndex((size) => size === convertTo)
    : Math.floor(Math.log(valueInBytes) / Math.log(k));
  let valueInUnit = valueInBytes / Math.pow(k, j);

  // Truncate value to supplied decimal place if not a whole number.
  const hasDecimal = valueInUnit % 1 !== 0;
  if (hasDecimal) {
    const order = Math.pow(10, decimals);
    valueInUnit = Math[roundFunc](valueInUnit * order) / order;
  }

  return {
    value: negative ? -valueInUnit : valueInUnit,
    unit: sizes[j],
  };
};
