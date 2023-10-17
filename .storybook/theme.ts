import { create } from "@storybook/theming/create";
import { name } from "../package.json";

export const theme = create({
  base: "light",
  brandTitle: name,
  brandImage: "https://assets.ubuntu.com/v1/142ae045-Canonical%20MAAS.png",
  brandTarget: "_self",

  // UI
  appBg: "#f7f7f7",
  appContentBg: "#FFF",
  appBorderColor: "#cdcdcd",
  appBorderRadius: 4,

  // Typography
  fontBase:
    '"Ubuntu variable", "Ubuntu", -apple-system, "Segoe UI", "Roboto", "Oxygen", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontCode:
    '"Ubuntu Mono variable", "Ubuntu Mono", Consolas, Monaco, Courier, monospace',

  // Text colors
  textColor: "#000",
  textInverseColor: "#000",

  // Toolbar default and active colors
  barTextColor: "#000",
  barSelectedColor: "#000",
  barBg: "#f7f7f7",

  // Form colors
  inputBg: "#FFF",
  inputBorder: "#cdcdcd",
  inputTextColor: "#000",
  inputBorderRadius: 4,
});
