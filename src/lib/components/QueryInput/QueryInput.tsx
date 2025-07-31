import { useState, useRef, useEffect, KeyboardEvent } from "react";

import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";

import "./QueryInput.scss";

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
  const [visible, setVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showingMore, setShowingMore] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxToShow = showingMore ? 15 : 4;
  const capped = suggestions.slice(0, maxToShow);
  const shouldShowMore = !showingMore && suggestions.length > maxToShow;

  const visibleSuggestions = shouldShowMore
    ? [...capped, { value: "Show more...", type: "more" }]
    : capped;

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setVisible(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

  const detectContextAndToken = (input: string) => {
    let depth = 0;
    let context = "";

    for (let i = input.length - 1; i >= 0; i--) {
      const char = input[i];

      if (char === ")") {
        depth++;
      } else if (char === "(") {
        if (depth === 0) {
          const before = input.slice(0, i).trimEnd();
          const match = before.match(/([a-zA-Z0-9_-]+)\s*:\s*$/);
          if (match) context = match[1];
          break;
        } else {
          depth--;
        }
      }
    }

    const workingString = input.trimEnd();
    let cursor = workingString.length - 1;

    while (cursor >= 0 && /[\s=]/.test(workingString[cursor])) {
      cursor--;
    }

    const end = cursor + 1;
    while (cursor >= 0 && /[^\s=(),]/.test(workingString[cursor])) {
      cursor--;
    }

    const token = workingString.slice(cursor + 1, end);

    return { context, token };
  };

  const selectSuggestion = (index: number) => {
    const selected = visibleSuggestions[index];
    if (!selected) return;

    if (selected.type === "more") {
      setShowingMore(true);
      return;
    }

    let newValue: string;

    if (selected.type === "filter") {
      const lastIndex = search.lastIndexOf(token);
      if (lastIndex !== -1) {
        newValue = search.slice(0, lastIndex) + selected.value + ":(";
      } else {
        newValue = selected.value + ":(";
      }
    } else {
      const lastIndex = search.lastIndexOf(token);
      if (context.length === 0) {
        newValue = search.slice(0, lastIndex) + selected.type + ":(=" + selected.value;
      } else if (lastIndex !== -1) {
        newValue = search.slice(0, lastIndex) + "=" + selected.value;
      } else {
        newValue = selected.value;
      }
      setVisible(false);
    }

    const { context: newContext, token: newToken } =
      detectContextAndToken(newValue);
    setContext(newContext);
    setToken(newToken);
    setSearch(newValue);
    setHighlightedIndex(0);
    setShowingMore(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!visible) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= suggestions.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? suggestions.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        selectSuggestion(highlightedIndex);
      } else {
        setVisible(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setVisible(false);
      setHighlightedIndex(-1);
    }
  };

  const handleFocus = () => {
    setVisible(true);
    setHighlightedIndex(0);
  };

  const handleChange = (value: string) => {
    const { context, token } = detectContextAndToken(value);
    setContext(context);
    setToken(token);
    setSearch(value);
    setHighlightedIndex(0);
    setVisible(!(value.length > 0 && value[value.length - 1] === ")"));
    setShowingMore(false);
  };

  const handleClear = () => {
    setVisible(false);
    setHighlightedIndex(-1);
  };

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
      />
      {visible && suggestions.length > 0 && (
        <ul className="p-query-input__list" ref={listRef}>
          {visibleSuggestions.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={`${item.value}-${index}`}
              className={classNames("p-query-input__item", {
                highlight: index === highlightedIndex,
              })}
              onClick={() => selectSuggestion(index)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={index === highlightedIndex}
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
