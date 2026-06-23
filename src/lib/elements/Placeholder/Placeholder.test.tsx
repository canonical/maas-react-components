import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { Placeholder } from "@/lib";

describe("Placeholder", () => {
  it("renders a skeleton block with role progressbar", () => {
    render(<Placeholder variant="block" />);
    expect(
      screen.getByRole("progressbar", { name: /loading/i }),
    ).toBeInTheDocument();
  });

  it("applies a width CSS string as an inline style", () => {
    render(<Placeholder variant="block" width="200px" />);
    const el = screen.getByRole("progressbar", { name: /loading/i });
    expect(el).toHaveStyle({ width: "200px" });
  });

  it("applies a height CSS string as an inline style", () => {
    render(<Placeholder variant="block" height="3rem" />);
    const el = screen.getByRole("progressbar", { name: /loading/i });
    expect(el).toHaveStyle({ height: "3rem" });
  });

  it("applies both width and height at the same time", () => {
    render(<Placeholder variant="block" width="100%" height="1.5rem" />);
    const el = screen.getByRole("progressbar", { name: /loading/i });
    expect(el).toHaveStyle({ width: "100%", height: "1.5rem" });
  });

  it("forwards extra className to the root element", () => {
    render(<Placeholder variant="block" className="custom-class" />);
    expect(screen.getByRole("progressbar", { name: /loading/i })).toHaveClass(
      "p-placeholder",
      "custom-class",
    );
  });

  it("does not render a sizer span when an explicit width is supplied alongside text", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Placeholder variant="block" text="XXXxxxx.xxxxxxxxx" width="300px" />,
    );
    expect(screen.queryByText("XXXxxxx.xxxxxxxxx")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /loading/i })).toHaveStyle({
      width: "300px",
    });
    vi.restoreAllMocks();
  });

  describe("deprecated", () => {
    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("renders the skeleton when isPending is true", () => {
      render(<Placeholder isPending text="Placeholder text" />);
      expect(
        screen.getByRole("progressbar", { name: /loading/i }),
      ).toBeInTheDocument();
    });

    it("applies fit-content width so the block matches the sizer when no explicit width is set", () => {
      render(<Placeholder isPending text="Placeholder text" />);
      expect(screen.getByRole("progressbar", { name: /loading/i })).toHaveStyle(
        {
          width: "fit-content",
        },
      );
    });

    it("uses the explicit width prop instead of fit-content when one is provided", () => {
      render(<Placeholder isPending text="Placeholder text" width="250px" />);
      expect(screen.getByRole("progressbar", { name: /loading/i })).toHaveStyle(
        {
          width: "250px",
        },
      );
    });

    it("hides the text content via aria-hidden when isPending is true", () => {
      render(<Placeholder isPending text="Placeholder text" />);
      const sizer = screen.queryByText(/Placeholder text/);
      expect(sizer).toHaveAttribute("aria-hidden", "true");
      expect(sizer).toHaveClass("p-placeholder__sizer");
    });

    it("renders children and no skeleton when isPending is false", () => {
      render(<Placeholder isPending={false}>Placeholder children</Placeholder>);
      expect(screen.getByText(/Placeholder children/)).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("hides children via aria-hidden when isPending is true", () => {
      render(<Placeholder isPending>Placeholder children</Placeholder>);
      expect(screen.queryByText(/Placeholder children/)).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("emits a deprecation warning for isPending", () => {
      render(<Placeholder isPending />);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("`isPending` prop is deprecated"),
      );
    });

    it("emits a deprecation warning for text", () => {
      render(<Placeholder isPending text="foo" />);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("`text` prop is deprecated"),
      );
    });

    it("emits a deprecation warning for children", () => {
      render(<Placeholder isPending>foo</Placeholder>);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Passing `children` to Placeholder is deprecated",
        ),
      );
    });
  });
});
