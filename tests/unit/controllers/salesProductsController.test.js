const { expect } = require('chai');
const sinon = require('sinon');
const salesProductsServices = require('../../../services/salesProductsServices');
const salesProductsController = require('../../../controllers/salesProductsController');

describe('Test Controller sales_products', () => {
  beforeEach(sinon.restore);

  describe('Ao criar uma venda', () => {
    const FAKE_DATA = { id: 1, itemsSold: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }] };
    const FAKE_SALES = [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 5
      }
    ]

    it('se sucesso retorna codigo 201', async () => {
      sinon.stub(salesProductsServices, 'create').resolves({ code: 201, data: FAKE_DATA });
      const req = { body: FAKE_SALES };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.create(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Testa se caso der algum erro', async () => {
      sinon.stub(salesProductsServices, 'create').resolves({ code: 400, message: 'error' });
      const req = { body: FAKE_SALES };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);

      await salesProductsController.create(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    })
  });
});