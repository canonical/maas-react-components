import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useMemo,
  useCallback,
} from "react";

import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";

import "./QueryInput.scss";

// Constants
const SUGGESTION_LIMITS = {
  DEFAULT: 4,
  EXPANDED: 15,
} as const;

const SPECIAL_CHARS = {
  OPEN_PAREN: "(",
  CLOSE_PAREN: ")",
  EQUALS: "=",
  COLON: ":",
  COMMA: ",",
} as const;

// Types
export type Suggestion = {
  value: string;
  type: string;
  disabled?: boolean;
};

type Props = {
  search: string;
  setSearch: (value: string) => void;
  context: string;
  setContext: (nextContext: string) => void;
  setToken: (nextToken: string) => void;
  suggestions: Suggestion[];
  placeholder?: string;
};

type ParseResult = {
  context: string;
  token: string;
  tokenStart: number;
  tokenEnd: number;
};

type SuggestionState = {
  isVisible: boolean;
  highlightedIndex: number;
  showingMore: boolean;
  cursorPosition: number;
};

// Utility functions
const parseQueryInput = (
  input: string,
  cursorPosition: number = input.length,
): ParseResult => {
  const context = extractContext(input, cursorPosition);
  const { token, tokenStart, tokenEnd } = extractToken(input, cursorPosition);
  return { context, token, tokenStart, tokenEnd };
};

const extractContext = (input: string, cursorPosition: number): string => {
  let depth = 0;

  // Start from cursor position and work backwards
  for (let i = cursorPosition - 1; i >= 0; i--) {
    const char = input[i];

    if (char === SPECIAL_CHARS.CLOSE_PAREN) {
      depth++;
    } else if (char === SPECIAL_CHARS.OPEN_PAREN) {
      if (depth === 0) {
        const before = input.slice(0, i).trimEnd();
        const match = before.match(/([a-zA-Z0-9_-]+)\s*:\s*$/);
        return match?.[1] || "";
      }
      depth--;
    }
  }

  return "";
};

const extractToken = (
  input: string,
  cursorPosition: number,
): {
  token: string;
  tokenStart: number;
  tokenEnd: number;
} => {
  let start = cursorPosition;
  let end = cursorPosition;

  // Find the end of the current token (move right until we hit a delimiter)
  while (end < input.length && /[^\s=(),]/.test(input[end])) {
    end++;
  }

  // Find the start of the current token (move left until we hit a delimiter)
  while (start > 0 && /[^\s=(),]/.test(input[start - 1])) {
    start--;
  }

  const token = input.slice(start, end);
  return { token, tokenStart: start, tokenEnd: end };
};

const shouldHideSuggestions = (
  input: string,
  cursorPosition: number,
): boolean => {
  const charAtCursor = input.charAt(cursorPosition - 1);
  return (
    cursorPosition > 0 &&
    (charAtCursor === SPECIAL_CHARS.CLOSE_PAREN ||
      charAtCursor === SPECIAL_CHARS.COMMA)
  );
};

export const QueryInput = ({
  search,
  setSearch,
  context,
  setContext,
  setToken,
  suggestions,
  placeholder,
}: Props) => {
  // State management
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    isVisible: false,
    highlightedIndex: -1,
    showingMore: false,
    cursorPosition: 0,
  });

  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Computed values
  const visibleSuggestions = useMemo(() => {
    const maxToShow = suggestionState.showingMore
      ? SUGGESTION_LIMITS.EXPANDED
      : SUGGESTION_LIMITS.DEFAULT;
    const capped = suggestions.slice(0, maxToShow);
    const shouldShowMore =
      !suggestionState.showingMore && suggestions.length > maxToShow;

    return shouldShowMore
      ? [...capped, { value: "Show more...", type: "more" }]
      : capped;
  }, [suggestions, suggestionState.showingMore]);

  // Event handlers
  const updateSuggestionState = useCallback(
    (
      updates:
        | Partial<SuggestionState>
        | ((prev: SuggestionState) => Partial<SuggestionState>),
    ) => {
      if (typeof updates === "function") {
        setSuggestionState((prev) => ({ ...prev, ...updates(prev) }));
      } else {
        setSuggestionState((prev) => ({ ...prev, ...updates }));
      }
    },
    [],
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        updateSuggestionState({
          isVisible: false,
          highlightedIndex: -1,
        });
      }
    },
    [updateSuggestionState],
  );

  const buildNewSearchValue = useCallback(
    (selected: Suggestion, parseResult: ParseResult): string => {
      const { tokenStart, tokenEnd } = parseResult;

      if (selected.type === "filter") {
        const replacement =
          selected.value + SPECIAL_CHARS.COLON + SPECIAL_CHARS.OPEN_PAREN;
        return (
          search.slice(0, tokenStart) + replacement + search.slice(tokenEnd)
        );
      }

      if (context.length === 0) {
        const replacement =
          selected.type +
          SPECIAL_CHARS.COLON +
          SPECIAL_CHARS.OPEN_PAREN +
          SPECIAL_CHARS.EQUALS +
          selected.value;
        return (
          search.slice(0, tokenStart) + replacement + search.slice(tokenEnd)
        );
      }

      const replacement =
        search.charAt(tokenStart - 1) === SPECIAL_CHARS.EQUALS
          ? selected.value
          : SPECIAL_CHARS.EQUALS + selected.value;
      return search.slice(0, tokenStart) + replacement + search.slice(tokenEnd);
    },
    [search, context],
  );

  const selectSuggestion = useCallback(
    (index: number) => {
      const selected = visibleSuggestions[index];
      if (!selected) return;

      if (selected.type === "more") {
        updateSuggestionState({ showingMore: true });
        return;
      }

      const parseResult = parseQueryInput(
        search,
        suggestionState.cursorPosition,
      );
      const newValue = buildNewSearchValue(selected, parseResult);
      const newCursorPosition =
        parseResult.tokenStart +
        (selected.type === "filter"
          ? selected.value.length + 2 // +2 for ":("
          : context.length === 0
            ? selected.type.length + selected.value.length + 3 // +3 for ":="
            : selected.value.length + 1); // +1 for "="

      const { context: newContext, token: newToken } = parseQueryInput(
        newValue,
        newCursorPosition,
      );

      setContext(newContext);
      setToken(newToken);
      setSearch(newValue);

      // Set cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition,
          );
        }
      }, 0);

      updateSuggestionState({
        highlightedIndex: 0,
        showingMore: false,
        isVisible: selected.type === "filter",
        cursorPosition: newCursorPosition,
      });
    },
    [
      visibleSuggestions,
      buildNewSearchValue,
      search,
      suggestionState.cursorPosition,
      context,
      setContext,
      setToken,
      setSearch,
      updateSuggestionState,
    ],
  );

  const updateCursorPosition = useCallback(() => {
    if (!inputRef.current) return;

    const cursorPosition = inputRef.current.selectionStart || 0;
    const { context: newContext, token: newToken } = parseQueryInput(
      search,
      cursorPosition,
    );

    setContext(newContext);
    setToken(newToken);

    updateSuggestionState((prev) => ({
      ...prev,
      isVisible: !shouldHideSuggestions(search, cursorPosition),
      cursorPosition,
    }));
  }, [search, setContext, setToken, updateSuggestionState]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      // Handle navigation keys that affect suggestions
      if (suggestionState.isVisible) {
        const suggestionCount = visibleSuggestions.length;

        switch (key) {
          case "ArrowDown":
            e.preventDefault();
            updateSuggestionState({
              highlightedIndex:
                (suggestionState.highlightedIndex + 1) % suggestionCount,
            });
            return;

          case "ArrowUp":
            e.preventDefault();
            updateSuggestionState({
              highlightedIndex:
                suggestionState.highlightedIndex <= 0
                  ? suggestionCount - 1
                  : suggestionState.highlightedIndex - 1,
            });
            return;

          case "Enter":
            e.preventDefault();
            if (suggestionState.highlightedIndex >= 0) {
              selectSuggestion(suggestionState.highlightedIndex);
            } else {
              updateSuggestionState({ isVisible: false });
            }
            return;

          case "Escape":
            e.preventDefault();
            updateSuggestionState({
              isVisible: false,
              highlightedIndex: -1,
            });
            return;
        }
      }

      // For arrow keys and other navigation keys, update cursor position after the event
      if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Home" ||
        key === "End"
      ) {
        setTimeout(updateCursorPosition, 0);
      }
    },
    [
      suggestionState,
      visibleSuggestions.length,
      updateSuggestionState,
      selectSuggestion,
      updateCursorPosition,
    ],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // Update cursor position after any key that might move the cursor
      const { key } = e;
      if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Home" ||
        key === "End"
      ) {
        updateCursorPosition();
      }
    },
    [updateCursorPosition],
  );

  const handleFocus = useCallback(() => {
    updateSuggestionState({
      isVisible: true,
      highlightedIndex: 0,
    });
  }, [updateSuggestionState]);

  const handleChange = useCallback(
    (value: string) => {
      // Get current cursor position
      const cursorPosition = inputRef.current?.selectionStart || value.length;
      const { context: newContext, token: newToken } = parseQueryInput(
        value,
        cursorPosition,
      );

      setContext(newContext);
      setToken(newToken);
      setSearch(value);

      updateSuggestionState({
        highlightedIndex: 0,
        isVisible: !shouldHideSuggestions(value, cursorPosition),
        showingMore: false,
        cursorPosition,
      });
    },
    [setContext, setToken, setSearch, updateSuggestionState],
  );

  const handleClick = useCallback(() => {
    // Update cursor position when user clicks in the input
    setTimeout(updateCursorPosition, 0);
  }, [updateCursorPosition]);

  const handleClear = useCallback(() => {
    updateSuggestionState({
      isVisible: false,
      highlightedIndex: -1,
    });
  }, [updateSuggestionState]);

  const handleMouseEnter = useCallback(
    (index: number) => {
      updateSuggestionState({ highlightedIndex: index });
    },
    [updateSuggestionState],
  );

  // Effects
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="p-query-input" ref={panelRef}>
      <SearchBox
        placeholder={placeholder}
        value={search}
        externallyControlled
        autoComplete="off"
        id="query-input"
        name="query-input"
        ref={inputRef}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClear={handleClear}
        onClick={handleClick}
        aria-expanded={suggestionState.isVisible}
        aria-haspopup="listbox"
        aria-owns="query-suggestions"
      />
      {suggestionState.isVisible && suggestions.length > 0 && (
        <ul
          className="p-query-input__list"
          ref={listRef}
          id="query-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          {visibleSuggestions.map((item, index) => (
            <li
              key={`${item.value}-${index}`}
              className={classNames("p-query-input__item", {
                highlight: index === suggestionState.highlightedIndex,
              })}
              onClick={() => selectSuggestion(index)}
              onKeyDown={() => selectSuggestion(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              role="option"
              aria-selected={index === suggestionState.highlightedIndex}
              tabIndex={-1}
            >
              <span className="p-query-input__item-label">
                <span
                  className={classNames({
                    "u-text--muted": item.type === "more",
                  })}
                >
                  {item.value}
                </span>
                {item.type === "filter" && (
                  <span className="u-text--muted">:()</span>
                )}
              </span>
              {item.type !== "more" && (
                <span className="u-text--muted u-align-text--right">
                  {item.type}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
