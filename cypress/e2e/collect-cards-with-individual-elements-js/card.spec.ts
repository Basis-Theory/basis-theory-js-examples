const expirationDate = `${String(new Date().getMonth() + 1).padStart(
  2,
  '0'
)}${String(new Date().getFullYear() + 1).slice(-2)}`;

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
    cy.visit('/');
    cy.wait(2000);
  });

  [visa, amex].forEach(({ brand, cardNumber, cvc }) =>
    it(`should tokenize/charge ${brand} card`, () => {
      cy.intercept('POST', 'https://api.basistheory.com/tokens').as('tokenize');
      cy.intercept('POST', '/api/charge').as('charge');

      cy.get('#card_number')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(cardNumber);
        });

      cy.get('#card_expiration_date')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(expirationDate);
        });

      cy.get('#card_verification_code')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(cvc.toString());
        });

      cy.get('button').contains('Submit').click();

      cy.wait('@tokenize').its('response.statusCode').should('equal', 201);
      cy.wait('@charge').its('response.statusCode').should('equal', 200);

      cy.contains('Test card charged $10.99 with Stripe.').should('be.visible');
    })
  );
});
