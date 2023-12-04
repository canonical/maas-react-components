import { render, screen } from "@testing-library/react";

import { ContentSection } from ".";

it("renders all elements correctly", () => {
  render(
    <ContentSection>
      <ContentSection.Title>Test Title</ContentSection.Title>
      <ContentSection.Content>Test Content</ContentSection.Content>
      <ContentSection.Footer>Test Footer</ContentSection.Footer>
    </ContentSection>,
  );
  expect(
    screen.getByRole("heading", { name: "Test Title" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Test Content")).toBeInTheDocument();
  expect(screen.getByText("Test Footer")).toBeInTheDocument();
});

it("renders custom classNames", () => {
  render(
    <ContentSection className="custom-content-section-class">
      <ContentSection.Title className="custom-title-class">
        Test Title
      </ContentSection.Title>
      <ContentSection.Content className="custom-content-class">
        Test Content
      </ContentSection.Content>
      <ContentSection.Footer className="custom-footer-class">
        Test Footer
      </ContentSection.Footer>
    </ContentSection>,
  );
  expect(
    document.querySelector(".custom-content-section-class"),
  ).toBeInTheDocument();
  expect(document.querySelector(".custom-title-class")).toBeInTheDocument();
  expect(document.querySelector(".custom-content-class")).toBeInTheDocument();
  expect(document.querySelector(".custom-footer-class")).toBeInTheDocument();
});

it("renders custom element for the title", () => {
  render(
    <ContentSection as="section">
      <ContentSection.Title as="h5">Test Title</ContentSection.Title>
      <ContentSection.Content>Test Content</ContentSection.Content>
      <ContentSection.Footer>Test Footer</ContentSection.Footer>
    </ContentSection>,
  );
  expect(
    screen.getByRole("heading", { level: 5, name: "Test Title" }),
  ).toBeInTheDocument();
});
