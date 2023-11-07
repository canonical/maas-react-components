import { render } from "@testing-library/react";

import { Navigation } from "@/lib/sections/Navigation/Navigation";

it("renders the light version of the icon by default", () => {
  const { container } = render(<Navigation.Icon name="information" />);
  expect(container.firstChild).toHaveClass("p-icon--information is-light");
});

it("can render a dark version of the icon", () => {
  const { container } = render(
    <Navigation.Icon light={false} name="information" />,
  );
  expect(container.firstChild).toHaveClass("p-icon--information");
});
