const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesProductsModels = require('../../../models/salesProductsModels');
const salesModels = require('../../../models/salesModels');

describe('Test Model Sales_Products e sales', () => {
  beforeEach(sinon.restore);

  describe('Ao criar uma venda', () => {
    const FAKE_SALES = { saleId: 1, productId: 1, quantity: 1 };
    it('se sucesso deve retornar true', async () => {
      sinon.stub(connection, 'execute').resolves(FAKE_SALES);
      const createSales = await salesProductsModels.create(FAKE_SALES);
      expect(createSales).to.be.true;
    });
    it('Deve retornar o id da venda', async () => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
      const insertId = await salesModels.create();
      expect(insertId).to.be.equal(1);
    });
  });
});