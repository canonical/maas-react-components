import * as React from "react";

import classNames from "classnames";

import "./MainToolbar.scss";

function useResizeObserver(ref: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = React.useState<DOMRect | null>(null);
  const animationFrameId = React.useRef<number | null>(null);

  const updateDimensions = React.useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDimensions(rect);
    }
  }, [ref]);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(updateDimensions);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
    };
  }, [ref, updateDimensions]);

  return dimensions;
}

const RectContext = React.createContext<DOMRect | null>(null);
const StackContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

type MainToolbarProps = {
  children: React.ReactNode;
};

/**
 * A toolbar component for the main content area of the page that automatically adjusts its layout based on available space.
 *
 * `MainToolbar` has two child components:
 * - `MainToolbar.Title`
 * - `MainToolbar.Controls`
 *
 * `MainToolbar.Title` and `MainToolbar.Controls` are wrapped to separate rows using flexbox.
 * `MainToolbar.Controls` switches to a stacked layout when it overflows the container.
 */
export const MainToolbar = ({ children }: MainToolbarProps) => {
  const ref = React.useRef(null);
  const rect = useResizeObserver(ref);
  const [isStacked, setIsStacked] = React.useState(false);
  return (
    <header
      className={classNames("main-toolbar", {
        "main-toolbar--stacked": isStacked,
      })}
      ref={ref}
    >
      <RectContext.Provider value={rect}>
        <StackContext.Provider value={[isStacked, setIsStacked]}>
          {children}
        </StackContext.Provider>
      </RectContext.Provider>
    </header>
  );
};

const MainToolbarTitle = ({ children, ...props }: React.PropsWithChildren) => {
  return (
    <h1
      className="main-toolbar__title p-heading--4"
      data-testid="main-toolbar-heading"
      {...props}
    >
      {children}
    </h1>
  );
};

const MainToolbarControls = ({ children }: React.PropsWithChildren) => {
  const rect = React.useContext(RectContext);
  const [isStacked, setIsStacked] = React.useContext(StackContext);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || !rect) {
      return;
    }
    setIsStacked(ref.current.getBoundingClientRect().width > rect.width);
  }, [setIsStacked, rect, ref]);

  return (
    <>
      {/* This hidden clone measures the non-stacked version of the toolbar controls. 
         It's necessary because we need to know when the full width version fits 
         while resizing the window up. It's always displayed in the background for comparison. */}
      <div
        aria-hidden="true"
        className="main-toolbar__controls main-toolbar__controls--observer"
        ref={ref}
        style={{ visibility: "hidden", position: "absolute" }}
      >
        {children}
      </div>
      <div
        className={classNames("main-toolbar__controls", {
          "main-toolbar__controls--stacked": isStacked,
        })}
      >
        {children}
      </div>
    </>
  );
};

MainToolbar.Title = MainToolbarTitle;
MainToolbar.Controls = MainToolbarControls;
