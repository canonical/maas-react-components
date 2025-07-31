import { useState, useRef, useEffect } from "react";

import { SearchBox } from "@canonical/react-components";
import classNames from "classnames";

import "./QueryInput.scss";

type Suggestion = {
  value: string;
  type: string;
  disabled?: boolean;
};

type Props = {
  suggestions: Suggestion[];
  onSelect: (value: string) => void;
  placeholder?: string;
};

export const QueryInput = ({ suggestions, onSelect, placeholder }: Props) => {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showingMore, setShowingMore] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? suggestions.filter((s) =>
        s.value.toLowerCase().includes(search.toLowerCase()),
      )
    : suggestions;

  const maxToShow = showingMore ? 15 : 4;
  const capped = filtered.slice(0, maxToShow);
  const shouldShowMore = !showingMore && filtered.length > maxToShow;

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

  const selectSuggestion = (index: number) => {
    const selected = visibleSuggestions[index];
    if (!selected) return;

    if (selected.type === "more") {
      setShowingMore(true);
      return;
    }

    onSelect(selected.value);
    setSearch(selected.value);
    setVisible(false);
    setHighlightedIndex(-1);
    setShowingMore(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!visible) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= filtered.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? filtered.length - 1 : next;
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
    setHighlightedIndex(-1);
  };

  const handleChange = (value: string) => {
    setSearch(value);
    setVisible(true);
    setHighlightedIndex(-1);
    setShowingMore(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisible(false);
      setHighlightedIndex(-1);
      setShowingMore(false);
    }, 150);
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
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {visible && filtered.length > 0 && (
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
