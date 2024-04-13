describe("Home page", () => {
  it("renders filters", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-test="filter-card"]').contains("Model");
    cy.get('[data-test="filter-card"]').contains("Od");
    cy.get('[data-test="filter-card"]').contains("Do");
    cy.get('[data-test="filter-card"]').contains("Cena do");
  });

  it("renders yacht tiles", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-test="tiles"]').contains("Biały Wilk");
    cy.get('[data-test="tiles"]').contains("Skellige");
    cy.get('[data-test="tiles"]').contains("Morrigan");
    cy.get('[data-test="tiles"]').contains("Saskia");
    cy.get('[data-test="tiles"]').contains("Ragnar");
    cy.get('[data-test="tiles"]').contains("Harpia");
  });

  it("model filter works", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-test="filter-model"]').click();
    cy.contains("Antila").click();
    cy.get('[data-test="tiles"]').contains("Biały Wilk");
    cy.get('[data-test="tiles"]').contains("Skellige");
    cy.get('[data-test="tiles"]').contains("Morrigan").should("not.exist");
    cy.get('[data-test="tiles"]').contains("Saskia").should("not.exist");
    cy.get('[data-test="tiles"]').contains("Ragnar").should("not.exist");
    cy.get('[data-test="tiles"]').contains("Harpia").should("not.exist");
  });

  it("navigates to yacht page", () => {
    cy.visit("http://localhost:3000/admin-panel");
    cy.get('[data-test="nav-/"]').click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("navigates to admin page", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-test="nav-/admin-panel"]').click();
    cy.url().should("eq", "http://localhost:3000/admin-panel");
  });

  it("changes application language", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-test="english"]').click();
    cy.contains("Maximum price");
    cy.contains("Cena do").should("not.exist");
    cy.get('[data-test="polish"]').click();
    cy.contains("Cena do");
    cy.contains("Maximum price").should("not.exist");
  });
});
