import { configureStore } from "@reduxjs/toolkit";

/**
 * Creates a minimal RTK store preloaded with `state`. The reducer is an
 * identity function, so it's only useful for tests that need a specific
 * state shape but don't exercise Redux logic (use a real store otherwise).
 */
export const createTestStore = <S extends object>(
  preloadedState?: Partial<S>,
) =>
  configureStore({
    reducer: (state = (preloadedState ?? {}) as S) => state,
    preloadedState: preloadedState as S | undefined,
  });
