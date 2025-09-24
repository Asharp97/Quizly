// cypress/e2e/homepage.cy.js
const gql = Cypress.env("graphqlEndpoint");
Cypress.Commands.add("loginReq", (email, password) => {
  return cy.request("POST", gql, {
    query: `mutation Login($email: String!, $password: String!) {
        Login(email: $email, password: $password) {
          accessToken
          refreshToken
          user {
            id
            email
            role
            name
          }
        }
      }`,
    variables: { email, password },
  });
});
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
  });
  it("should load and display the main elements", () => {
    cy.contains("Quizly just Does It All");
    cy.get("button").contains("START NOW").should("be.visible");
    cy.get("button").contains("Login").should("be.visible");
    cy.get("button").contains("Sign Up").should("be.visible");
  });

  it("should show the description paragraph", () => {
    cy.contains(
      "Build engaging quizzes, insightful surveys, and seamless forms crafted for educators, enterprises, and everyone in between."
    ).should("be.visible");
    cy.contains("Quizly just Does It All").should("be.visible");
  });

  it("should login and return token", () => {
    cy.loginReq("ali-h@hotmail.com", "ali123").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.Login.accessToken).to.exist;
      expect(response.body.data.Login.refreshToken).to.exist;
      expect(response.body.data.Login.user).to.exist;
    });
  });

  it("should navigate to dashboard when logged in", () => {
    // todo: why this only works with 3 clicks?
    cy.login();
    cy.url().should("include", "/dashboard");
  });

  it("when visiting /quizended  should go back to homepage", () => {
    cy.visit("/quizended");
    cy.url().should("include", "/quizended");
    cy.get("button").contains("okay").click();
    cy.url().should("include", "/");
  });
});
