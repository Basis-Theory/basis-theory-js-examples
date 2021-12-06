import { Chance } from 'chance';

context('bank tokenization', () => {
  const chance = new Chance();

  beforeEach(() => {
    cy.visit('bank');
    cy.wait(1500);
  });

  it(`should tokenize/fund bank`, () => {
    cy.intercept('POST', 'https://api.basistheory.com/atomic/banks').as(
      'tokenize'
    );
    cy.intercept('POST', '/api/bank/fund').as('fund');

    cy.get('#name').type('Jane Doe');

    cy.get('#routing_number>iframe').iframe(() => {
      cy.get('input').eq(0).type('021000021');
    });
    cy.get('#account_number>iframe').iframe(() => {
      cy.get('input')
        .eq(0)
        .type(
          chance.string({
            numeric: true,
            length: 10,
          })
        );
    });

    cy.get('button').contains('Submit').click();

    cy.wait('@tokenize').its('response.statusCode').should('equal', 201);
    cy.wait('@fund').then(({ response: { statusCode, body } }) => {
      expect(statusCode).to.equal(200);
      cy.contains(
        `Created Spreedly Payment Method successfully: ${body.payment_method_token}`
      ).should('be.visible');
    });
  });
});
