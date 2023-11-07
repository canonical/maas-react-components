import { render, screen } from "@testing-library/react";

import { Navigation, NavigationBar } from "./Navigation";

describe("Navigation", () => {

  it("renders without crashing", () => {
    render(<Navigation isCollapsed={false}>Navigation component</Navigation>);
    expect(screen.getByText("Navigation component")).toBeInTheDocument();
  });

  it("applies the correct classname when collapsed", () => {
    render(<Navigation isCollapsed={true}>Navigation component</Navigation>);
    expect(screen.getByText("Navigation component")).toHaveClass("is-collapsed");
  });
})

describe("NavigationBar", () => {
  it("renders without crashing", () => {
    render(<NavigationBar>Navigation bar</NavigationBar>);
    expect(screen.getByText("Navigation bar")).toBeInTheDocument();
  });
})
