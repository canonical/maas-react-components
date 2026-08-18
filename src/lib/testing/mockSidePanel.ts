import { vi } from "vitest";

/**
 * Mocks the `useSidePanel` hook, returning `mockOpen`/`mockClose` spies.
 */
export const mockSidePanel = async () => {
  const mockUseSidePanel = vi.spyOn(
    await import("../index"), // the library's own barrel export
    "useSidePanel",
  );

  const mockOpen = vi.fn();
  const mockClose = vi.fn();
  let isOpen = false;

  const makeReturnValue = () => ({
    isOpen,
    title: "",
    size: "regular" as const,
    component: null,
    props: {},
    openSidePanel: mockOpen,
    closeSidePanel: mockClose,
    setSidePanelSize: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    isOpen = false;

    mockOpen.mockImplementation(() => {
      isOpen = true;
      mockUseSidePanel.mockReturnValue(makeReturnValue());
    });

    mockClose.mockImplementation(() => {
      isOpen = false;
      mockUseSidePanel.mockReturnValue(makeReturnValue());
    });

    mockUseSidePanel.mockReturnValue(makeReturnValue());
  });

  return { mockOpen, mockClose };
};
