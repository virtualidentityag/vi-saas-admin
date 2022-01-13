describe("pre login", () => {
  beforeEach(() => {
    cy.visit("localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });

  it("displays a form with input fields for username and password", () => {
    cy.get("form").should("be.visible");
    cy.get("#basic_username").should("be.visible");
    cy.get("#basic_password").should("be.visible");
  });

  it("keeps the submit button disabled until both inputs are filled", () => {
    cy.get(".ant-btn-primary").should("be.disabled");
  });

  it("shows warning when username and password filled when submit-button is clicked", () => {
    cy.get(".ant-btn-primary").click();
    cy.contains("message.form.login.username");
    cy.contains("message.form.login.password");
    cy.get("#basic_username").type("ritter");
  });

  it("validates a correct email address as username", () => {
    cy.get(".ant-btn-primary").click();
    cy.get("#basic_username").type("ritter");
    cy.contains("message.form.login.username");
    cy.get("#basic_username").clear();
    cy.get("#basic_username").type("ritter@meinkoenig.de");
    cy.get(".ant-btn-primary").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get("message.form.login.username").should("not.exist");
  });

  it("lets you log in when username and password are filled in correctly", () => {
    cy.get("#basic_username").type("ritter@meinkoenig.de");
    cy.get("#basic_password").type("12345koe*");
    cy.get(".ant-btn-primary").click();
    cy.contains("Dashboard");
  });
});
