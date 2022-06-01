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
    it(`should tokenize ${brand} card`, () => {
      cy.intercept('POST', 'https://api.basistheory.com/tokens').as('tokenize');

      cy.get('#cardNumber')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(cardNumber);
        });

      cy.get('#cardExpirationDate')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(expirationDate);
        });

      cy.get('#cardVerificationCode')
        .find('iframe')
        .iframe(() => {
          cy.get('input').type(cvc.toString());
        });

      cy.get('button').contains('Submit').click();

      cy.wait('@tokenize').its('response.statusCode').should('equal', 201);

      // checks token id
      cy.contains(/"id":\s".+?"/u)
        // checks masked number
        .contains(
          `"number": "${'X'.repeat(cardNumber.length - 4)}${cardNumber.slice(
            -4
          )}"`
        )
        .should('be.visible');
    })
  );
});
