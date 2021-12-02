context('bank tokenization', () => {
  beforeEach(() => {
    cy.visit('bank');
    cy.wait(1500);
  });

  it(`should tokenize/fund bank`, () => {
    cy.intercept('POST', 'https://api.basistheory.com/atomic/banks').as(
      'tokenize'
    );
    cy.intercept('POST', '/api/bank/fund').as('fund');

    cy.get('#routing_number>iframe').iframe(() => {
      cy.get('input').eq(0).type('222222226');
    });
    cy.get('#account_number>iframe').iframe(() => {
      cy.get('input').eq(0).type('1234567890');
    });

    cy.get('button').contains('Submit').click();

    cy.wait('@tokenize').its('response.statusCode').should('equal', 201);
    cy.wait('@fund').its('response.statusCode').should('equal', 200);

    cy.contains('Created Dwolla funding source successfully.', {
      timeout: 15000,
    }).should('be.visible');
  });
});
