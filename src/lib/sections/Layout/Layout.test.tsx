import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { SidePanelContextProvider } from "@/lib";
import Layout from "@/lib/sections/Layout/Layout";

it("renders header", async () => {
  render(
    <MemoryRouter>
      <SidePanelContextProvider>
        <Layout
          isSecondaryNavVisible={false}
          navigation={null}
          pageTitle="MAAS Site Manager"
          secondaryNavigation={null}
          view="settings"
        >
          <div />
        </Layout>
        ,
      </SidePanelContextProvider>
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { level: 1, name: /MAAS Site Manager/i }),
    ).toBeInTheDocument();
  });
});
