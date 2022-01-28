// / <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Get access to iframe DOM
     * @example cy.iframe(() => {
     *   cy.get('#id').type('123');
     * });
     */
    iframe: (callback: () => void) => void;
  }
}
