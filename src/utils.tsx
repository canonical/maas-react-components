import { CodeSnippet } from "@canonical/react-components";

/**
 * Returns a component that renders the result of a util function.
 */
export const getUtilStoryComponent = <T, U extends (...args: T[]) => T>(
  title: string,
  fn: U,
) => {
  const UtilStoryComponent = (args: T) => {
    const result = fn(args);
    return (
      <>
        <h1 className="sbdocs-title p-heading--3">{title}</h1>
        <CodeSnippet
          blocks={[
            {
              title: `${title}(${
                args != null && typeof args === "object"
                  ? `{ ${Object.entries(args)
                      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                      .join(", ")} }`
                  : JSON.stringify(args)
              })`,
              code: JSON.stringify(result),
            },
          ]}
        />
      </>
    );
  };
  UtilStoryComponent.displayName = "UtilStoryComponent";
  return UtilStoryComponent;
};
