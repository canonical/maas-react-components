import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders without crashing", () => {
  render(
    <Navigation.LogoIcon>
      <svg aria-label="an svg">
        <ellipse cx="15.57" cy="111.46" rx="13.44" ry="13.3" />
      </svg>
    </Navigation.LogoIcon>,
  );
  expect(screen.getByLabelText("an svg")).toHaveClass("p-panel__logo-icon p-navigation__logo-icon")
});
