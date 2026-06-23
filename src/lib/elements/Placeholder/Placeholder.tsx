import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from "react";
import { useEffect } from "react";
import "./Placeholder.scss";

import classNames from "classnames";

type PlaceholderProps = {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** @deprecated */
  isPending?: boolean;
  /** @deprecated */
  text?: string;
  /** @deprecated */
  children?: ReactNode;
  variant?: "block" | "text";
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Placeholder - A pulsing skeleton block used to represent loading content
 *
 * Renders a rectangular block with a pulse animation that matches the dimensions
 * of the content it is replacing. Use `width` and `height` to control the size
 * explicitly, or rely on the default block layout for full-width skeletons.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS class names applied to the root element
 * @param {CSSProperties["width"]} [props.width] - Width of the skeleton block; accepts any valid CSS value (e.g. "200px", "100%", "12rem"). When omitted the block stretches to fill its container
 * @param {CSSProperties["height"]} [props.height] - Height of the skeleton block; accepts any valid CSS value (e.g. "1rem", "48px", "3em"). When omitted the block collapses unless content or a sizer provides height
 * @param {"block" | "text"} [props.variant="text"] - Rendering variant. `"block"` renders a standalone skeleton div; `"text"` is the legacy variant that requires `isPending` to be set
 * @param {HTMLAttributes<HTMLDivElement>} [props.style] - Any HTML div attributes (e.g. `style`, `data-*`, `aria-*`) are forwarded to the root element. `style` is merged with the component's internal width/height styles, with consumer values taking precedence
 * @param {boolean} [props.isPending] - @deprecated Use conditional rendering at the call-site instead. When `true` the skeleton is shown; when `false` the `children` are rendered. Will be removed in a future major version
 * @param {string} [props.text] - @deprecated Width is now controlled via the `width` prop. When provided the text is rendered in a visually-hidden sizer span that gives the block its natural content width. Will be removed in a future major version
 * @param {ReactNode} [props.children] - @deprecated Pass children outside the Placeholder and control visibility at the call-site. Will be removed in a future major version
 *
 * @returns {ReactElement} The rendered skeleton block, or the children when `isPending` is `false`
 *
 * @example
 * // Standalone skeleton block
 * <Placeholder width="200px" height="1rem" />
 *
 * @example
 * // Composed loading state
 * {isLoading ? <Placeholder width="100%" height="1.5rem" /> : <p>{content}</p>}
 */
export const Placeholder = ({
  className,
  width,
  height,
  isPending,
  text,
  children,
  variant = "text",
  style,
  ...divProps
}: PlaceholderProps): ReactElement => {
  useEffect(() => {
    if (isPending !== undefined) {
      console.warn(
        "[Placeholder] The `isPending` prop is deprecated and will be removed in a future major version. " +
          "Control skeleton visibility with conditional rendering at the call-site instead.",
      );
    }
  }, [isPending]);

  useEffect(() => {
    if (text !== undefined) {
      console.warn(
        "[Placeholder] The `text` prop is deprecated and will be removed in a future major version. " +
          "Use the `width` prop to set the skeleton width.",
      );
    }
  }, [text]);

  useEffect(() => {
    if (children !== undefined) {
      console.warn(
        "[Placeholder] Passing `children` to Placeholder is deprecated and will be removed in a future major version. " +
          "Render children outside the Placeholder and control visibility at the call-site.",
      );
    }
  }, [children]);

  // Legacy behavior
  if (variant === "text") {
    if (!isPending) {
      return <>{children}</>;
    }
    const delay = Math.floor(Math.random() * 750);
    // When no explicit width is set, let the hidden sizer content drive the width.
    const legacyWidth = width ?? "fit-content";
    return (
      <div
        aria-label="loading"
        className={classNames("p-placeholder", className)}
        role="progressbar"
        style={{ animationDelay: `${delay}ms`, width: legacyWidth, height, ...style }}
        {...divProps}
      >
        {/* Hidden sizer: makes the block exactly as wide as the text/children */}
        <span aria-hidden="true" className="p-placeholder__sizer">
          {text || children || "Loading"}
        </span>
      </div>
    );
  }

  // New behavior
  const resolvedWidth = text && !width ? "fit-content" : width;
  return (
    <div
      aria-label="loading"
      className={classNames("p-placeholder", className)}
      role="progressbar"
      style={{ width: resolvedWidth, height, ...style }}
      {...divProps}
    />
  );
};
