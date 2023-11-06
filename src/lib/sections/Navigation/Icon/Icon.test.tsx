import { render, screen } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders the light version of the icon by defaults", () => {
  render(
    <span data-testid="test-icon-wrapper">
      <Navigation.Icon name="information" />
    </span>
  )
  expect(screen.getByTestId("test-icon-wrapper").firstChild).toHaveClass("p-icon--information is-light")
})

it("can render a dark version of the icon", () => {
  render(
    <span data-testid="test-icon-wrapper">
      <Navigation.Icon light={false} name="information" />
    </span>
  )
  expect(screen.getByTestId("test-icon-wrapper").firstChild).toHaveClass("p-icon--information")
})
