// cypress/e2e/dashboard.cy.js
Cypress.Commands.add("login", () => {
  return cy
    .get('[data-testid="start-now-button"]')
    .click()
    .click()
    .click()
    .then(() => {
      cy.get('[data-testid="auth-form"]').should("exist").and("be.visible");
      cy.get('[data-testid="email-input"]').type("ali-h@hotmail.com");
      cy.get('[data-testid="password-input"]').type("ali123");
      cy.get('[data-testid="login-button"]').click();
    });
});

describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });
  it("should load and display the main elements", () => {
    cy.contains("Quizzes");
    cy.contains("Create New Question");
  });
  it("should show quiz modal when hitting plus button", () => {
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.contains("Submit Quiz").should("be.visible");
  });
  it("should show quiz modal when hitting plus button", () => {
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.get('[data-testid="quiz-title-input"]').type("Cypress Quiz");
    cy.get('[data-testid="submit-quiz-button"]').click();
    cy.contains("Cypress Quiz").should("be.visible");
  });
  it("should show question modal when hitting plus button", () => {
    cy.get('[data-testid="create-question-button"]').click();
    cy.contains("Submit Question").should("be.visible");
  });
  it("should create a question when filling the form and submitting", () => {
    cy.get('[data-testid="create-question-button"]').click();
    cy.get('[data-testid="question-input"]').type("What is Cypress?", {force: true});
    cy.get('[data-testid="submit-question-button"]').click();
    cy.contains("What is Cypress?").should("be.visible");
  });
  it("should be able to delete a question", () => {
    cy.get('[data-testid="create-question-button"]').click();
    cy.get('[data-testid="question-input"]').type("sample Cypress?", {
      force: true,
    });
    cy.get('[data-testid="submit-question-button"]').click();
    cy.contains("sample Cypress?").should("be.visible");
    cy.get('[data-testid="delete-question-button"]').last().click();
    cy.contains("Delete Question").should("be.visible").click();
    cy.contains("sample is Cypress?").should("not.exist");
  });
});
