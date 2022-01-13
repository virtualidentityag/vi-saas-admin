/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable func-names */

const USERONEEMAIL = Cypress.env("userOne");
const USERONEPASSWORD = Cypress.env("passwordOne");

describe("Check Berater page and edit name", function () {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#basic_username").type(USERONEEMAIL);
    cy.get("#basic_password").type(USERONEPASSWORD);
    cy.get(".ant-btn-primary").click();
    cy.wait(100);
    cy.get(".menuItem").eq(2).click();
    cy.wait(100);
  });

  it("Checks Title", function () {
    cy.contains("counselor");
  });

  it("Checks Berater Card Existence", function () {
    cy.get(".ant-form").should("be.visible");
  });

  it("Checks Edit Button", function () {
    cy.get(".ant-form").eq(1);
    cy.get(".ant-btn").eq(1).click();
    cy.wait(100);
    cy.get(".ant-form").eq(1);
    cy.get(".ant-card-body").eq(0);
    cy.get(".ant-form-item").eq(0);
    cy.get("#firstName").click().clear().type("Christoph");
    cy.get(".ant-btn").eq(1).click();
    cy.get(".ant-form").eq(0);
    cy.get(".ant-card-body").eq(0);
    cy.get(".ant-form-item-control").eq(0).contains("Christoph");
  });
});

describe("Check Berater page and delete Card/Counselor", function () {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#basic_username").type(USERONEEMAIL);
    cy.get("#basic_password").type(USERONEPASSWORD);
    cy.get(".ant-btn-primary").click();
    cy.wait(100);
    cy.get(".menuItem").eq(2).click();
    cy.wait(100);
  });

  it("Checks Delete Button opens modal", function () {
    cy.get("form")
      .eq(0)
      .within(($form) => {
        cy.get(".ant-btn").eq(1).should("exist").click();
      });
    cy.root().get(".ant-modal").should("be.visible");
  });

  it("Check Delete Button removes 1 Card", function () {
    let countedForms;
    cy.get("form")
      .its("length")
      .then((length) => {
        countedForms = length;
      });

    cy.get("form")
      .eq(0)
      .within(() => {
        cy.get(".ant-btn").eq(1).should("exist").click();
      });
    cy.root()
      .get(".ant-modal")
      .within(() => {
        cy.get("button").eq(1).click();
      });

    cy.get("form")
      .its("length")
      .then((length) => {
        assert(countedForms - 1 === length);
      });
  });
});
