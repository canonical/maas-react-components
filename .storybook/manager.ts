import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";
import { name } from "../package.json";

const theme = create({
  base: "light",
  brandTitle: name,
  brandImage: "https://assets.ubuntu.com/v1/142ae045-Canonical%20MAAS.png",
  brandTarget: "_self",
});

addons.setConfig({
  theme,
});
