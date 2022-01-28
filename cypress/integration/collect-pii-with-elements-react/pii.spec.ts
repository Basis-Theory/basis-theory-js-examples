import { Chance } from 'chance';

context('pii tokenization', () => {
  const chance = new Chance();

  beforeEach(() => {
    cy.visit('/');
    cy.wait(1500);
  });

  it(`should tokenize pii`, () => {
    cy.intercept('POST', 'https://api.basistheory.com/tokenize').as('tokenize');

    cy.get('#fullName>iframe').iframe(() => {
      cy.get('input').eq(0).type(chance.name());
    });
    cy.get('#ssn>iframe').iframe(() => {
      cy.get('input').eq(0).type(chance.ssn());
    });

    cy.get('button').contains('Submit').click();

    cy.wait('@tokenize').its('response.statusCode').should('equal', 200);

    // checks created tokens
    cy.contains(/"fullName":\s".+?"/u) // simple token id for the fullName
      .contains(/"ssn":\s\{/u) // `ssn
      .should('be.visible');
  });
});
