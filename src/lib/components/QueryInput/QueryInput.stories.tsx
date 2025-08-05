import { useState } from "react";

import { Meta, StoryObj } from "@storybook/react";

import { QueryInput, Suggestion } from "@/lib";

const mockSuggestionData: Suggestion[] = [
  {
    value: "status",
    type: "filter",
  },
  {
    value: "deployment_target",
    type: "filter",
  },
  {
    value: "owner",
    type: "filter",
  },
  {
    value: "pool",
    type: "filter",
  },
  {
    value: "architecture",
    type: "filter",
  },
  {
    value: "tag",
    type: "filter",
  },
  {
    value: "workload",
    type: "filter",
  },
  {
    value: "kvm",
    type: "filter",
  },
  {
    value: "subnet",
    type: "filter",
  },
  {
    value: "fabric",
    type: "filter",
  },
  {
    value: "zone",
    type: "filter",
  },
  {
    value: "vlan",
    type: "filter",
  },
  {
    value: "space",
    type: "filter",
  },
  {
    value: "new",
    type: "status",
  },
  {
    value: "ready",
    type: "status",
  },
  {
    value: "deployed",
    type: "status",
  },
  {
    value: "memory",
    type: "deployment_target",
  },
  {
    value: "disk",
    type: "deployment_target",
  },
  {
    value: "maas",
    type: "owner",
  },
  {
    value: "acbuyukyilmaz",
    type: "owner",
  },
  {
    value: "default",
    type: "pool",
  },
  {
    value: "reserve",
    type: "pool",
  },
  {
    value: "amd64/generic",
    type: "architecture",
  },
  {
    value: "mlod2s001",
    type: "tag",
  },
  {
    value: "mlod2s002",
    type: "tag",
  },
  {
    value: "mlod2s003",
    type: "tag",
  },
  {
    value: "eu6ww001",
    type: "workload",
  },
  {
    value: "eu6ww002",
    type: "workload",
  },
  {
    value: "able-egret",
    type: "kvm",
  },
  {
    value: "busy-dog",
    type: "kvm",
  },
  {
    value: "bright-wombat",
    type: "kvm",
  },
  {
    value: "10.141.77.0/24",
    type: "subnet",
  },
  {
    value: "104.255.113.0/24",
    type: "subnet",
  },
  {
    value: "fabric-0",
    type: "fabric",
  },
  {
    value: "fabric-1",
    type: "fabric",
  },
  {
    value: "default",
    type: "zone",
  },
  {
    value: "danger",
    type: "zone",
  },
  {
    value: "default",
    type: "vlan",
  },
  {
    value: "empty",
    type: "space",
  },
  {
    value: "outer",
    type: "space",
  },
];

const meta: Meta<typeof QueryInput> = {
  title: "Components/QueryInput",
  component: QueryInput,
  parameters: {
    docs: {
      description: {
        component:
          "QueryInput is a search field component with externally controlled " +
          "assistive suggestion and insertion features. It's designed to construct " +
          "queries using autocomplete and suggestion endpoints managed by external queries.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    suggestions: mockSuggestionData,
  },
  argTypes: {
    disabled: {
      description: "Determines the disabled state",
      control: { type: "boolean", default: false },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    search: {
      description:
        "Externally controlled search query string. Must be passed in to the component for token detection",
      control: false,
      table: {
        type: { summary: "string" },
        required: true,
      },
    },
    setSearch: {
      description: "State setter function for updating search query string",
      control: false,
      table: {
        type: { summary: "Dispatch<SetStateAction<string>>" },
        required: true,
      },
    },
    context: {
      description:
        "Externally controlled context string. Must be passed in to the component for context-aware suggestions",
      control: false,
      table: {
        type: { summary: "string" },
        required: true,
      },
    },
    setContext: {
      description: "State setter function for updating context string",
      control: false,
      table: {
        type: { summary: "Dispatch<SetStateAction<string>>" },
        required: true,
      },
    },
    setToken: {
      description:
        "State setter function for updating currently editing token string",
      control: false,
      table: {
        type: { summary: "Dispatch<SetStateAction<string>>" },
        required: true,
      },
    },
    suggestions: {
      description: "Externally controlled suggestion array",
      control: false,
      table: {
        type: { summary: "Suggestion[]" },
        required: true,
      },
    },
    isLoading: {
      description: "Determines the suggestion loading state",
      control: { type: "boolean", default: false },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      description: "Search field placeholder text",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof QueryInput>;

export const Default: Story = {
  render: (args) => {
    const [search, setSearch] = useState<string>("");
    const [context, setContext] = useState<string>("");
    const [token, setToken] = useState<string>("");

    let suggestions: Suggestion[] = args.suggestions;

    if (search === "") {
      suggestions = suggestions.filter((s) => s.type === "filter");
    } else if (context.length > 0) {
      suggestions = suggestions.filter((s) => s.type === context);
    }

    if (token.length > 0) {
      suggestions = suggestions.filter((s) =>
        s.value.toLowerCase().includes(token.toLowerCase()),
      );
    }

    return (
      <QueryInput
        search={search}
        setSearch={setSearch}
        context={context}
        setContext={setContext}
        setToken={setToken}
        suggestions={suggestions}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <QueryInput
        disabled
        search={""}
        setSearch={() => {}}
        context={""}
        setContext={() => {}}
        setToken={() => {}}
        suggestions={[]}
      />
    );
  },
};

export const Loading: Story = {
  render: (args) => {
    const [search, setSearch] = useState<string>("");
    const [context, setContext] = useState<string>("");
    const [_, setToken] = useState<string>("");

    return (
      <QueryInput
        isLoading
        search={search}
        setSearch={setSearch}
        context={context}
        setContext={setContext}
        setToken={setToken}
        suggestions={args.suggestions}
      />
    );
  },
};
