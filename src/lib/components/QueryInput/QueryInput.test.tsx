import { useState } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { QueryInput, type Suggestion } from "@/lib/components/QueryInput";

describe("QueryInput", () => {
  // Mock functions for props
  const mockSetSearch = vi.fn();
  const mockSetContext = vi.fn();
  const mockSetToken = vi.fn();

  // Sample suggestions data
  const mockSuggestions: Suggestion[] = [
    { value: "active", type: "status" },
    { value: "inactive", type: "status" },
    { value: "pending", type: "status" },
    { value: "status", type: "filter" },
    { value: "created", type: "filter" },
  ];

  const defaultProps = {
    search: "",
    setSearch: mockSetSearch,
    context: "",
    setContext: mockSetContext,
    setToken: mockSetToken,
    suggestions: mockSuggestions,
  };

  // Stateful wrapper for tests that require actual external state management
  const QueryInputTestWrapper = () => {
    const [search, setSearch] = useState("");
    const [context, setContext] = useState("");
    const [token, setToken] = useState("");

    return (
      <>
        <QueryInput
          search={search}
          setSearch={setSearch}
          context={context}
          setContext={setContext}
          setToken={setToken}
          suggestions={mockSuggestions}
        />
        <span data-testid="context">{context}</span>
        <span data-testid="token">{token}</span>
      </>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<QueryInput {...defaultProps} />);

    expect(screen.getByTestId("p-query-input")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<QueryInput {...defaultProps} placeholder="Search items..." />);

    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<QueryInput {...defaultProps} disabled />);

    const input = screen.getByRole("searchbox");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-disabled", "true");
  });

  it("updates search value on input change", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "test query");

    expect(input).toHaveValue("test query");
  });

  it("displays current search value", () => {
    render(<QueryInput {...defaultProps} search="current search" />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("current search");
  });

  it("shows suggestions when focused and suggestions exist", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });

  it("hides suggestions when no suggestions available", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} suggestions={[]} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows loading spinner when isLoading=true", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} isLoading />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("limits suggestions to 4 by default", async () => {
    const user = userEvent.setup();
    const manySuggestions: Suggestion[] = Array.from(
      { length: 10 },
      (_, i) => ({
        value: `item${i}`,
        type: "test",
      }),
    );

    render(<QueryInput {...defaultProps} suggestions={manySuggestions} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(5); // 4 items + "Show more..."
    expect(screen.getByText("Show more...")).toBeInTheDocument();
  });

  it("shows 'Show more...' when more than 4 suggestions", async () => {
    const user = userEvent.setup();
    const manySuggestions: Suggestion[] = Array.from({ length: 6 }, (_, i) => ({
      value: `item${i}`,
      type: "test",
    }));

    render(<QueryInput {...defaultProps} suggestions={manySuggestions} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByText("Show more...")).toBeInTheDocument();
  });

  it("expands to show more suggestions when 'Show more' clicked", async () => {
    const user = userEvent.setup();
    const manySuggestions: Suggestion[] = Array.from(
      { length: 10 },
      (_, i) => ({
        value: `item${i}`,
        type: "test",
      }),
    );

    render(<QueryInput {...defaultProps} suggestions={manySuggestions} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const showMoreButton = screen.getByText("Show more...");
    await user.click(showMoreButton);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(10); // All 10 items, no more "Show more..."
    expect(screen.queryByText("Show more...")).not.toBeInTheDocument();
  });

  it("selects suggestion on click", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const suggestion = screen.getByText("active");
    await user.click(suggestion);

    expect(mockSetSearch).toHaveBeenCalled();
  });

  it("selects suggestion on Enter key when highlighted", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(mockSetSearch).toHaveBeenCalled();
  });

  it("updates highlightedIndex on mouse hover", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const suggestion = screen.getAllByRole("option")[1];
    await user.hover(suggestion);

    expect(suggestion).toHaveAttribute("aria-selected", "true");
  });

  it("closes suggestions on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <QueryInput {...defaultProps} />
        <button>Outside button</button>
      </div>,
    );

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const outsideButton = screen.getByRole("button", {
      name: "Outside button",
    });
    await user.click(outsideButton);

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("closes suggestions on Escape key", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ArrowDown moves highlight down and wraps to top", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    // First item should be highlighted by default on focus
    const firstOption = screen.queryAllByRole("option")[0];
    expect(firstOption).toHaveAttribute("aria-selected", "true");

    // Move down
    await user.keyboard("{ArrowDown}");
    const secondOption = screen.queryAllByRole("option")[1];
    expect(firstOption).toHaveAttribute("aria-selected", "false");
    expect(secondOption).toHaveAttribute("aria-selected", "true");

    // Continue to last item
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    const lastOption =
      screen.queryAllByRole("option")[mockSuggestions.length - 1];
    expect(lastOption).toHaveAttribute("aria-selected", "true");

    // Wrap to first
    await user.keyboard("{ArrowDown}");
    expect(firstOption).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowUp moves highlight up and wraps to bottom", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    // Move up from first item should wrap to last
    await user.keyboard("{ArrowUp}");
    const lastOption =
      screen.queryAllByRole("option")[mockSuggestions.length - 1];
    expect(lastOption).toHaveAttribute("aria-selected", "true");

    // Move up to previous
    await user.keyboard("{ArrowUp}");
    const secondLastOption =
      screen.queryAllByRole("option")[mockSuggestions.length - 2];
    expect(lastOption).toHaveAttribute("aria-selected", "false");
    expect(secondLastOption).toHaveAttribute("aria-selected", "true");
  });

  it("Enter selects highlighted suggestion", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);
    await user.keyboard("{ArrowDown}"); // Move to second item
    await user.keyboard("{Enter}");

    expect(mockSetSearch).toHaveBeenCalled();
  });

  it("Focus shows suggestions with first item highlighted", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    const firstOption = screen.queryAllByRole("option")[0];
    expect(firstOption).toHaveAttribute("aria-selected", "true");
  });

  it("calls setContext with correct context", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "status:(");

    expect(screen.getByTestId("context")).toHaveTextContent("status");
  });

  it("calls setToken with correct token", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "test");

    expect(screen.getByTestId("token")).toHaveTextContent("test");
  });

  it("extracts context from filter syntax", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "status:(john");

    expect(screen.getByTestId("context")).toHaveTextContent("status");
    expect(screen.getByTestId("token")).toHaveTextContent("john");
  });

  it("builds correct query for filter suggestions", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    await user.click(screen.getByText("Show more..."));
    const filterSuggestion = screen.getByText("created");
    await user.click(filterSuggestion);

    // Should build "status:(" format
    expect(input).toHaveValue("created:(");
  });

  it("builds correct query for value suggestions without context", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const valueSuggestion = screen.getByText("active");
    await user.click(valueSuggestion);

    // Should build "status:(=active" format when no context
    expect(mockSetSearch).toHaveBeenCalledWith("status:(=active");
  });

  it("builds correct query for value suggestions with context", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} context="status" />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const valueSuggestion = screen.getByText("active");
    await user.click(valueSuggestion);

    // Should append "=active" when context exists
    expect(mockSetSearch).toHaveBeenCalledWith("=active");
  });

  it("handles suggestions with existing equals sign", async () => {
    const user = userEvent.setup();
    render(<QueryInputTestWrapper />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    await user.type(input, "status:(=");
    const valueSuggestion = screen.getByText("active");
    await user.click(valueSuggestion);

    // Should append just the value when equals already exists
    expect(input).toHaveValue("status:(=active");
  });

  it("hides suggestions after closing parenthesis", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "status:(active)");

    // Suggestions should be hidden after closing parenthesis
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("hides suggestions after comma", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "status:(active,");

    // Suggestions should be hidden after comma
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("updates context/token on cursor movement", async () => {
    const user = userEvent.setup();
    render(
      <QueryInput {...defaultProps} search="status:(active) created:(test)" />,
    );

    const input = screen.getByRole("searchbox");
    await user.click(input);

    // Move cursor to different position
    await user.keyboard("{ArrowLeft}");
    await user.keyboard("{ArrowLeft}");

    // Should update context and token based on new cursor position
    expect(mockSetContext).toHaveBeenCalled();
    expect(mockSetToken).toHaveBeenCalled();
  });

  it("shows spinner during loading", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} isLoading />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles empty suggestions array", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} suggestions={[]} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles disabled suggestions", async () => {
    const user = userEvent.setup();
    const disabledSuggestions: Suggestion[] = [
      { value: "disabled", type: "status", disabled: true },
    ];

    render(<QueryInput {...defaultProps} suggestions={disabledSuggestions} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const suggestion = screen.getByText("disabled");
    await user.click(suggestion);

    // Should still work even with disabled flag (component doesn't prevent selection)
    expect(mockSetSearch).toHaveBeenCalled();
  });

  it("sets correct aria-expanded state", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-expanded", "false");

    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-haspopup='listbox'", () => {
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("sets aria-owns pointing to suggestions", () => {
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-owns", "query-suggestions");
  });

  it("sets proper role attributes", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.click(input);

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-label", "Search suggestions");

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("handles rapid typing without breaking", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");

    // Type rapidly
    await user.type(input, "status:(active) created:(test)");

    expect(mockSetSearch).toHaveBeenCalled();
    expect(mockSetContext).toHaveBeenCalled();
    expect(mockSetToken).toHaveBeenCalled();
  });

  it("handles clear button functionality", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} search="existing text" />);

    // SearchBox component should have a clear button
    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    // Should hide suggestions when cleared
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("maintains cursor position correctly", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "test query");

    // Move cursor to middle
    await user.keyboard("{ArrowLeft}");
    await user.keyboard("{ArrowLeft}");
    await user.keyboard("{ArrowLeft}");

    // Should update context/token based on cursor position
    expect(mockSetContext).toHaveBeenCalled();
    expect(mockSetToken).toHaveBeenCalled();
  });

  it("handles malformed query input gracefully", async () => {
    const user = userEvent.setup();
    render(<QueryInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");

    // Type malformed query with unmatched parentheses
    await user.type(input, "status:((((incomplete");

    // Should not throw errors and should still call setters
    expect(mockSetSearch).toHaveBeenCalled();
    expect(mockSetContext).toHaveBeenCalled();
    expect(mockSetToken).toHaveBeenCalled();
  });
});
