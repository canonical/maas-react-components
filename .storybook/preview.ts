import type { Preview } from "@storybook/react";
import "./preview.scss";
import DocumentationTemplate from "./DocumentationTemplate.mdx";
import { theme } from "./theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewMode: "docs",
    docs: {
      page: DocumentationTemplate,
      theme,
    },
    status: {
      // currently supported statuses are: legacy, candidate
      statuses: {
        legacy: {
          background: "#c7162b",
          color: "#ffffff",
          description:
            "This is a legacy component and should not be used in new projects",
        },
        candidate: {
          background: "#0f95a1",
          color: "#ffffff",
          description: "This component is a candidate for wider use",
        },
      },
    },
  },
};
export default preview;
