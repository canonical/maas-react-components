import type { RequestHandler } from "msw";
import { setupServer } from "msw/node";

/**
 * Sets up an MSW mock server for use in tests.
 *
 * @param client  - The Hey-API client instance (from `@/app/apiclient/client.gen` in maas-ui).
 * @param baseUrl - The base URL to configure on the client.
 * @param handlers - MSW request handlers.
 */
export const setupMockServer = (
  client: { setConfig: (config: { baseUrl: string }) => void },
  baseUrl: string,
  ...handlers: RequestHandler[]
) => {
  client.setConfig({ baseUrl });

  const mockServer = setupServer(...handlers);

  beforeAll(() => {
    mockServer.listen({ onUnhandledRequest: "error" });
  });
  afterEach(() => {
    mockServer.resetHandlers();
  });
  afterAll(() => {
    mockServer.close();
  });

  return mockServer;
};
