/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable func-names */

const USERONEEMAIL = Cypress.env("userOne");
const USERONEPASSWORD = Cypress.env("passwordOne");

describe("Basic Test", function () {
  it("Checks the Title", function () {
    cy.visit("/");
    cy.contains("Admin Login");
  });

  it("Checks the URL", function () {
    cy.url().should("include", "localhost:3000/admin");
  });
});

describe("URL-Test Settings ", function () {
  afterEach(() => {
    cy.get("span").contains("Logout").click();
  });

  it("Checks the URL in Settings", function () {
    cy.visit("/");
    cy.get("#basic_username").type(USERONEEMAIL);
    cy.get("#basic_password").type(USERONEPASSWORD);
    cy.get(".ant-btn-primary").click();
    cy.get("span").contains("Einstellungen").click();
    cy.url().should("include", "/theme-settings");
  });
});

describe("URL-Tests Counselor", function () {
  afterEach(() => {
    cy.get("span").contains("Logout").click();
  });

  it("Checks the URL in berater", function () {
    cy.visit("/");
    cy.get("#basic_username").type(USERONEEMAIL);
    cy.get("#basic_password").type(USERONEPASSWORD);
    cy.get(".ant-btn-primary").click();
    cy.get("span").contains("Berater").click();
    cy.url().should("include", "/berater");
  });
});

describe("Check lateral navigtion", function () {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#basic_username").type(USERONEEMAIL);
    cy.get("#basic_password").type(USERONEPASSWORD);
    cy.get(".ant-btn-primary").click();
  });

  /* later
   it("Checks the URL in Dashboard Button", function () {
    cy.get(".menuItem").eq(0).click();
    cy.url().should("include", `localhost:3000`);
  });
*/
  it("Checks the URL in Settings Button", function () {
    cy.get("span").contains("Einstellungen").click();
    cy.url().should("include", "/theme-settings");
    cy.get("span").contains("Logout").click();
  });

  it("Checks the URL in Berater Button", function () {
    cy.get("span").contains("Berater").click();
    cy.url().should("include", "/berater");
    cy.get("span").contains("Logout").click();
  });

  /* later egain
  it("Checks the URL in Profil Button", function () {
    cy.get(".menuItem").eq(3).click();
    cy.url().should("include", "/profil");
  });
*/
  it("Checks the URL in Logout Button", function () {
    cy.get("span").contains("Logout").click();
    cy.url().should("include", "/login");
  });
});
