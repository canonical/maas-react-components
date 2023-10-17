import { create } from "@storybook/theming/create";
import { name } from "../package.json";

export const theme = create({
  base: "light",
  brandTitle: name,
  brandImage: "https://assets.ubuntu.com/v1/142ae045-Canonical%20MAAS.png",
  brandTarget: "_self",
});
