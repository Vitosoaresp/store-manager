const { expect } = require('chai');
const sinon = require('sinon');
const salesProductsServices = require('../../../services/salesProductsServices');
const salesProductsController = require('../../../controllers/salesProductsController');

describe('Test Controller sales_products', () => {
  beforeEach(sinon.restore);

  describe('Ao listar as vendas', () => {
    const FAKE_SALES_PRODUCTS = [{ saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 }, { saleId: 2, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 }];

    it('Se sucesso ao listar todas as vendas deve retornar code 200', async () => {
      sinon.stub(salesProductsServices, 'getAll').resolves(FAKE_SALES_PRODUCTS);
      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getAll(req, res);
      expect(res.status.calledWith(201)).to.be.false;
    });

    it('Deve listar a venda especifica pelo ID', async () => {
      sinon.stub(salesProductsServices, 'getById').resolves({ code: 201, data: FAKE_SALES_PRODUCTS[0] });
      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getById(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Caso a venda nao existe deve retornar a mensagem "Sales not found"', async () => {
      sinon.stub(salesProductsServices, 'getById').resolves({ code: 404, message: 'Sale not found' });
      const req = { id: 999999 };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getById(req, res);
      console.log(res.status.calledWith(404), 'aaaaaaaa-----------------');
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

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