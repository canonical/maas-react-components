import Layout from "./Layout";

import { renderWithMemoryRouter, screen, waitFor } from "@/utils/test-utils";

it("renders header", async () => {
  renderWithMemoryRouter(
    <Layout
      isSecondaryNavVisible={false}
      navigation={null}
      pageTitle="MAAS Site Manager"
      secondaryNavigation={null}
      view="settings"
    >
      <div />
    </Layout>,
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { level: 1, name: /MAAS Site Manager/i })).toBeInTheDocument();
  });
});
