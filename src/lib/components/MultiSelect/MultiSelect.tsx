import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";

import "./MultiSelect.scss";
import {
  Button,
  CheckboxInput,
  SearchBox,
  useClickOutside,
  useOnEscapePressed,
} from "@canonical/react-components";

import { FadeInDown } from "@/lib/components/FadeInDown";

export type MultiSelectItem = {
  label: string;
  value: string | number;
  group?: string;
};

export type MultiSelectProps = {
  disabled?: boolean;
  error?: string;
  selectedItems?: MultiSelectItem[];
  help?: string;
  label?: string | null;
  onItemsUpdate?: (items: MultiSelectItem[]) => void;
  placeholder?: string;
  required?: boolean;
  items: MultiSelectItem[];
  disabledItems?: MultiSelectItem[];
  renderItem?: (item: MultiSelectItem) => ReactNode;
  dropdownHeader?: ReactNode;
  dropdownFooter?: ReactNode;
  variant?: "condensed" | "search";
};

type MultiSelectDropdownProps = {
  isOpen: boolean;
  items: MultiSelectItem[];
  selectedItems: MultiSelectItem[];
  disabledItems: MultiSelectItem[];
  header?: ReactNode;
  updateItems: (newItems: MultiSelectItem[]) => void;
  footer?: ReactNode;
  shouldPinSelectedItems?: boolean;
  groupFn?: (
    items: Parameters<typeof getGroupedItems>[0],
  ) => ReturnType<typeof getGroupedItems>;
  sortFn?: (
    items: Parameters<typeof getSortedItems>[0],
  ) => ReturnType<typeof getSortedItems>;
} & React.HTMLAttributes<HTMLDivElement>;

const getSortedItems = (items: MultiSelectItem[]) =>
  [...items].sort((a, b) =>
    a.label.localeCompare(b.label, "en", { numeric: true }),
  );

const getGroupedItems = (items: MultiSelectItem[]) =>
  items.reduce(
    (groups, item) => {
      const group = item.group || "Ungrouped";
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, MultiSelectItem[]>,
  );

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedItems,
  disabledItems,
  header,
  updateItems,
  isOpen,
  footer,
  sortFn = getSortedItems,
  groupFn = getGroupedItems,
  ...props
}: MultiSelectDropdownProps) => {
  const hasGroup = useMemo(() => items.some((item) => item.group), [items]);
  const sortedItems = useMemo(() => sortFn(items), [items, sortFn]);
  const groupedItems = useMemo(
    () => (hasGroup ? groupFn(sortedItems) : { Ungrouped: sortedItems }),
    [items, groupFn],
  );

  const selectedItemValues = useMemo(
    () => new Set(selectedItems.map((item) => item.value)),
    [selectedItems],
  );
  const disabledItemValues = useMemo(
    () => new Set(disabledItems.map((item) => item.value)),
    [disabledItems],
  );

  return (
    <FadeInDown isVisible={isOpen} className={"put-above"}>
      <div className="multi-select__dropdown" role="listbox" {...props}>
        {header ? header : null}
        {Object.entries(groupedItems).map(([group, items]) => (
          <div className="multi-select__group" key={group}>
            {hasGroup ? (
              <h5 className="multi-select__dropdown-header">{group}</h5>
            ) : null}
            <ul className="multi-select__dropdown-list" aria-label={group}>
              {items.map((item) => {
                const isSelected = selectedItemValues.has(item.value);
                const isDisabled = disabledItemValues.has(item.value);
                return (
                  <li key={item.value} className="multi-select__dropdown-item">
                    <CheckboxInput
                      disabled={isDisabled}
                      label={item.label}
                      checked={isSelected}
                      onChange={() =>
                        updateItems(
                          isSelected
                            ? selectedItems.filter(
                                (i) => i.value !== item.value,
                              )
                            : [...selectedItems, item],
                        )
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {footer ? <div className="multi-select__footer">{footer}</div> : null}
      </div>
    </FadeInDown>
  );
};

/**
 * Component allowing to select multiple items from a list of options.
 *
 * `MultiSelectDropdown` displays the dropdown with options which are grouped and sorted alphabetically.
 * `SearchBox` or `Button` is used to trigger the dropdown depending on the variant.
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  disabled,
  selectedItems: externalSelectedItems = [],
  label,
  onItemsUpdate,
  placeholder,
  required = false,
  items = [],
  disabledItems = [],
  dropdownHeader,
  dropdownFooter,
  variant = "search",
}: MultiSelectProps) => {
  const wrapperRef = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
    setFilter("");
  });
  useOnEscapePressed(() => {
    setIsDropdownOpen(false);
    setFilter("");
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isDropdownOpen) {
      setFilter("");
    }
  }, [isDropdownOpen]);

  const [internalSelectedItems, setInternalSelectedItems] = useState<
    MultiSelectItem[]
  >([]);
  const selectedItems = externalSelectedItems || internalSelectedItems;

  const updateItems = (newItems: MultiSelectItem[]) => {
    const uniqueItems = Array.from(new Set(newItems));
    setInternalSelectedItems(uniqueItems);
    onItemsUpdate && onItemsUpdate(uniqueItems);
  };

  const dropdownId = useId();
  const inputId = useId();
  const selectedItemsLabel = selectedItems
    .filter((selectedItem) =>
      items.some((item) => item.value === selectedItem.value),
    )
    .map((el) => el.label)
    .join(", ");
  return (
    <div ref={wrapperRef}>
      <div className="multi-select">
        {variant === "search" ? (
          <SearchBox
            externallyControlled
            aria-controls={dropdownId}
            aria-expanded={isDropdownOpen}
            id={inputId}
            role="combobox"
            aria-label={label || placeholder || "Search"}
            disabled={disabled}
            autoComplete="off"
            onChange={(value) => {
              setFilter(value);
              // reopen if dropdown has been closed via ESC
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={placeholder ?? "Search"}
            required={required}
            type="text"
            value={filter}
            className="multi-select__input"
          />
        ) : (
          <Button
            role="combobox"
            aria-label={label || placeholder || "Select items"}
            aria-controls={dropdownId}
            aria-expanded={isDropdownOpen}
            className="multi-select__select-button"
            multiple
            onFocus={() => setIsDropdownOpen(true)}
            onClick={() => setIsDropdownOpen(true)}
            options={items}
          >
            {selectedItems.length > 0
              ? selectedItemsLabel
              : placeholder ?? "Select items"}
          </Button>
        )}
        <MultiSelectDropdown
          id={dropdownId}
          isOpen={isDropdownOpen}
          items={
            filter.length > 0
              ? items.filter((item) =>
                  item.label.toLowerCase().includes(filter.toLowerCase()),
                )
              : items
          }
          selectedItems={selectedItems}
          disabledItems={disabledItems}
          header={dropdownHeader}
          updateItems={updateItems}
          footer={
            dropdownFooter ? (
              dropdownFooter
            ) : (
              <>
                <Button
                  appearance="link"
                  onClick={() => {
                    const enabledItems = items.filter(
                      (item) =>
                        !disabledItems.some(
                          (disabledItem) => disabledItem.value === item.value,
                        ),
                    );
                    updateItems([...selectedItems, ...enabledItems]);
                  }}
                  type="button"
                >
                  Select all
                </Button>
                <Button
                  appearance="link"
                  onClick={() => {
                    const disabledSelectedItems = selectedItems.filter((item) =>
                      disabledItems.some(
                        (disabledItem) => disabledItem.value === item.value,
                      ),
                    );
                    updateItems(disabledSelectedItems);
                  }}
                  type="button"
                >
                  Clear
                </Button>
              </>
            )
          }
        />
      </div>
    </div>
  );
};
