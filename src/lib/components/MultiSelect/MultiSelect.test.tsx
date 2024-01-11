import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

import { MultiSelect } from "./MultiSelect";

const items = ["item one", "item two"];

it("shows options when opened", async () => {
  render(<MultiSelect items={items} />);

  items.forEach((item) => {
    expect(
      screen.queryByRole("checkbox", { name: item }),
    ).not.toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("combobox"));

  items.forEach((item) => {
    expect(screen.queryByRole("checkbox", { name: item })).toBeInTheDocument();
  });
});

it("opens the dropdown when the combobox is clicked", async () => {
  render(<MultiSelect items={items} />);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

it("can have some options preselected", async () => {
  render(<MultiSelect items={items} selectedItems={[items[0]]} />);
  expect(screen.getByRole("listitem", { name: items[0] })).toBeInTheDocument();
  expect(
    screen.queryByRole("checkbox", { name: items[0] }),
  ).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("combobox"));
  expect(screen.getByRole("checkbox", { name: items[0] })).toBeInTheDocument();
});

it("can select options from the dropdown", async () => {
  const onItemsUpdate = vi.fn();
  render(<MultiSelect items={items} onItemsUpdate={onItemsUpdate} />);
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByLabelText(items[0]));
  await waitFor(() => expect(onItemsUpdate).toHaveBeenCalledWith([items[0]]));
});

it("can hide the options that have been selected", async () => {
  render(<MultiSelect items={items} />);
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByLabelText(items[0]));
  expect(screen.queryByTestId("selected-option")).not.toBeInTheDocument();
});

it("can remove options that have been selected", async () => {
  const onItemsUpdate = vi.fn();
  render(
    <MultiSelect
      items={items}
      selectedItems={items}
      onItemsUpdate={onItemsUpdate}
    />,
  );
  expect(screen.getAllByRole("listitem", { name: /item/ })).toHaveLength(2);
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(
    within(screen.getByRole("listbox")).getByLabelText(items[0]),
  );
  expect(onItemsUpdate).toHaveBeenCalledWith([items[1]]);
});

it("can filter option list", async () => {
  render(<MultiSelect items={[...items, "other"]} />);
  await userEvent.click(screen.getByRole("combobox"));
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  await userEvent.type(screen.getByRole("combobox"), "item");
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(2));
});

it("can display a dropdown header", async () => {
  render(
    <MultiSelect
      header={<span data-testid="dropdown-header">Header</span>}
      items={items}
    />,
  );
  await userEvent.click(screen.getByRole("combobox"));
  expect(screen.getByRole("heading", { name: "Header" })).toBeInTheDocument();
});
