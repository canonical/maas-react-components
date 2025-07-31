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
  token: string;
  setToken: (nextToken: string) => void;
  suggestions: Suggestion[];
  placeholder?: string;
};

type ParseResult = {
  context: string;
  token: string;
};

type SuggestionState = {
  isVisible: boolean;
  highlightedIndex: number;
  showingMore: boolean;
};

// Utility functions
const parseQueryInput = (input: string): ParseResult => {
  const context = extractContext(input);
  const token = extractToken(input);
  console.log("token", token);
  return { context, token };
};

const extractContext = (input: string): string => {
  let depth = 0;

  for (let i = input.length - 1; i >= 0; i--) {
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

// TODO: token should be from the actual cursor, and whitespace should break token
const extractToken = (input: string): string => {
  const workingString = input.trimEnd();
  let cursor = workingString.length - 1;

  // Skip whitespace and equals signs
  while (cursor >= 0 && /[\s=]/.test(workingString[cursor])) {
    cursor--;
  }

  const end = cursor + 1;

  // Find the start of the token
  while (cursor >= 0 && /[^\s=(),]/.test(workingString[cursor])) {
    cursor--;
  }

  return workingString.slice(cursor + 1, end);
};

const shouldHideSuggestions = (input: string): boolean => {
  return (
    input.length > 0 && input[input.length - 1] === SPECIAL_CHARS.CLOSE_PAREN
  );
};

export const QueryInput = ({
  search,
  setSearch,
  context,
  setContext,
  token,
  setToken,
  suggestions,
  placeholder,
}: Props) => {
  // State management
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    isVisible: false,
    highlightedIndex: -1,
    showingMore: false,
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
    (updates: Partial<SuggestionState>) => {
      setSuggestionState((prev) => ({ ...prev, ...updates }));
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
    (selected: Suggestion): string => {
      if (selected.type === "filter") {
        const lastIndex = search.lastIndexOf(token);
        return lastIndex !== -1
          ? search.slice(0, lastIndex) +
              selected.value +
              SPECIAL_CHARS.COLON +
              SPECIAL_CHARS.OPEN_PAREN
          : selected.value + SPECIAL_CHARS.COLON + SPECIAL_CHARS.OPEN_PAREN;
      }

      const lastIndex = search.lastIndexOf(token);

      if (context.length === 0) {
        return (
          search.slice(0, lastIndex) +
          selected.type +
          SPECIAL_CHARS.COLON +
          SPECIAL_CHARS.OPEN_PAREN +
          SPECIAL_CHARS.EQUALS +
          selected.value
        );
      }

      if (lastIndex !== -1) {
        return (
          search.slice(0, lastIndex) + SPECIAL_CHARS.EQUALS + selected.value
        );
      }

      return selected.value;
    },
    [search, token, context],
  );

  const selectSuggestion = useCallback(
    (index: number) => {
      const selected = visibleSuggestions[index];
      if (!selected) return;

      if (selected.type === "more") {
        updateSuggestionState({ showingMore: true });
        return;
      }

      const newValue = buildNewSearchValue(selected);
      const { context: newContext, token: newToken } =
        parseQueryInput(newValue);

      setContext(newContext);
      setToken(newToken);
      setSearch(newValue);

      updateSuggestionState({
        highlightedIndex: 0,
        showingMore: false,
        isVisible: selected.type === "filter",
      });
    },
    [
      visibleSuggestions,
      buildNewSearchValue,
      setContext,
      setToken,
      setSearch,
      updateSuggestionState,
    ],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!suggestionState.isVisible) return;

      const { key } = e;
      const suggestionCount = visibleSuggestions.length;

      switch (key) {
        case "ArrowDown":
          e.preventDefault();
          updateSuggestionState({
            highlightedIndex:
              (suggestionState.highlightedIndex + 1) % suggestionCount,
          });
          break;

        case "ArrowUp":
          e.preventDefault();
          updateSuggestionState({
            highlightedIndex:
              suggestionState.highlightedIndex <= 0
                ? suggestionCount - 1
                : suggestionState.highlightedIndex - 1,
          });
          break;

        case "Enter":
          e.preventDefault();
          if (suggestionState.highlightedIndex >= 0) {
            selectSuggestion(suggestionState.highlightedIndex);
          } else {
            updateSuggestionState({ isVisible: false });
          }
          break;

        case "Escape":
          e.preventDefault();
          updateSuggestionState({
            isVisible: false,
            highlightedIndex: -1,
          });
          break;
      }
    },
    [
      suggestionState,
      visibleSuggestions.length,
      updateSuggestionState,
      selectSuggestion,
    ],
  );

  const handleFocus = useCallback(() => {
    updateSuggestionState({
      isVisible: true,
      highlightedIndex: 0,
    });
  }, [updateSuggestionState]);

  const handleChange = useCallback(
    (value: string) => {
      const { context: newContext, token: newToken } = parseQueryInput(value);

      setContext(newContext);
      setToken(newToken);
      setSearch(value);

      updateSuggestionState({
        highlightedIndex: 0,
        isVisible: !shouldHideSuggestions(value),
        showingMore: false,
      });
    },
    [setContext, setToken, setSearch, updateSuggestionState],
  );

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
        onClear={handleClear}
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
