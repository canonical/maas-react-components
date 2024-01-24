import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";

import {
  CheckboxInput,
  Button,
  Input,
  useClickOutside,
  useOnEscapePressed,
} from "@canonical/react-components";

import "./MultiSelect.scss";
import { FadeInDown } from "@/lib/components/FadeInDown";

export type MultiSelectItem = {
  label: string;
  value: string | number;
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
  header?: ReactNode;
};

type MultiSelectDropdownProps = {
  isOpen: boolean;
  items: MultiSelectItem[];
  selectedItems: MultiSelectItem[];
  disabledItems: MultiSelectItem[];
  header?: ReactNode;
  updateItems: (newItems: MultiSelectItem[]) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedItems,
  disabledItems,
  header,
  updateItems,
  isOpen,
  ...props
}: MultiSelectDropdownProps) => {
  return (
    <FadeInDown isVisible={isOpen}>
      <div className="multi-select__dropdown" role="listbox" {...props}>
        {header && <h5 className="multi-select__dropdown-header">{header}</h5>}
        <ul className="multi-select__dropdown-list">
          {items.map((item) => (
            <li key={item.value} className="multi-select__dropdown-item">
              <CheckboxInput
                disabled={disabledItems.some(disabledItem => disabledItem.value === item.value)}
                label={item.label}
                checked={selectedItems.some(selectedItem => selectedItem.value === item.value)}
                onChange={() =>
                  updateItems(
                    selectedItems.some(selectedItem => selectedItem.value === item.value)
                      ? selectedItems.filter((i) => i.value !== item.value)
                      : [...selectedItems, item],
                  )
                }
              />
            </li>
          ))}
        </ul>
        <div className="multi-select__buttons">
          <Button
            appearance="link"
            onClick={() => {
              const enabledItems = items.filter(
                (item) => !disabledItems.some(disabledItem => disabledItem.value === item.value),
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
                disabledItems.some(disabledItem => disabledItem.value === item.value),
              );
              updateItems(disabledSelectedItems);
            }}
            type="button"
          >
            Clear
          </Button>
        </div>
      </div>
    </FadeInDown>
  );
};

/**
 * Component allowing to select multiple items from a list of options.
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  disabled,
  selectedItems: externalSelectedItems = [],
  label,
  onItemsUpdate,
  placeholder = "Select items",
  required = false,
  items = [],
  disabledItems = [],
  header,
}: MultiSelectProps) => {
  const wrapperRef = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });
  useOnEscapePressed(() => setIsDropdownOpen(false));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isDropdownOpen) {
      setFilter("");
    }
  }, [isDropdownOpen]);

  const [internalSelectedItems, setInternalSelectedItems] = useState<MultiSelectItem[]>(
    [],
  );
  const selectedItems = externalSelectedItems || internalSelectedItems;

  const updateItems = (newItems: MultiSelectItem[]) => {
    const uniqueItems = Array.from(new Set(newItems));
    setInternalSelectedItems(uniqueItems);
    onItemsUpdate && onItemsUpdate(uniqueItems);
  };

  const selectedElements = selectedItems.filter((selectedItem) => items.some(item => item.value === selectedItem.value)).map((item) => (
    <li key={item.value} className="multi-select__selected-item" aria-label={item.label}>
      {item.label}
    </li>
  ));

  const dropdownId = useId();
  const inputId = useId();

  return (
    <div ref={wrapperRef}>
      <div className="multi-select">
        {selectedItems.length > 0 && (
          <ul className="multi-select__selected-list" aria-label="selected">
            {selectedElements}
          </ul>
        )}
        <Input
          aria-controls={dropdownId}
          aria-expanded={isDropdownOpen}
          id={inputId}
          role="combobox"
          label={label}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => setFilter(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          required={required}
          type="text"
          value={filter}
          className="multi-select__input"
        />
        <MultiSelectDropdown
          id={dropdownId}
          isOpen={isDropdownOpen}
          items={
            filter.length > 0
              ? items.filter((item) => item.label.includes(filter))
              : items
          }
          selectedItems={selectedItems}
          disabledItems={disabledItems}
          header={header}
          updateItems={updateItems}
        />
      </div>
    </div>
  );
};
