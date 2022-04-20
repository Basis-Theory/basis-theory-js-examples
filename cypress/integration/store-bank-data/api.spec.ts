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
      expect(response.body).to.contain('{"routing_number":"021000021","account_number":"XXXXXXXXX1099"}');
    });
  });

  it('should retrieve', () => {
    cy.request('get').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.contain('{"routing_number":"021000021","account_number":"1234567891099"}');
    });
  });
});
