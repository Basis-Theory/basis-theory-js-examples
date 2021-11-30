const expirationDate = `${new Date().getMonth() + 1}${String(
  new Date().getFullYear() + 1
).slice(-2)}`;

const visa = {
  brand: 'visa',
  cardNumber: '4242424242424242',
  cvc: 123,
};
const amex = {
  brand: 'amex',
  cardNumber: '378282246310005',
  cvc: 1234,
};

context('card tokenization', () => {
  beforeEach(() => {
    cy.visit('card');
    cy.wait(1500);
  });

  [visa, amex].forEach(({ brand, cardNumber, cvc }) =>
    it(`should tokenize/charge ${brand} card`, () => {
      cy.intercept('POST', 'https://api.basistheory.com/atomic/cards').as(
        'tokenize'
      );
      cy.intercept('POST', '/api/charge').as('charge');

      cy.get('iframe').iframe(() => {
        // types everything, testing the "focus next input" feature
        cy.get('input').eq(0).type(`${cardNumber}${expirationDate}${cvc}`);
      });

      cy.get('button').contains('Submit').click();

      cy.wait('@tokenize').its('response.statusCode').should('equal', 201);
      cy.wait('@charge').its('response.statusCode').should('equal', 200);

      cy.contains('Test card charged $10.99 with Stripe.', {
        timeout: 15000,
      }).should('be.visible');
    })
  );
});
