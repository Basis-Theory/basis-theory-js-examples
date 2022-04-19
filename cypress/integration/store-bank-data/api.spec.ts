context('store banks API', () => {
  it('should start empty', () => {
    cy.request({
      url: 'get',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('should create', () => {
    cy.request('POST', 'create', {
      routingNumber: '110000000',
      accountNumber: '000123456789',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should retrieve masked', () => {
    cy.request('get_mask').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('routingNumber', '110000000');
      expect(response.body).to.have.property('accountNumber', 'XXXXXXXX6789');
    });
  });

  it('should retrieve', () => {
    cy.request('get').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('routingNumber', '110000000');
      expect(response.body).to.have.property('accountNumber', '000123456789');
    });
  });
});
