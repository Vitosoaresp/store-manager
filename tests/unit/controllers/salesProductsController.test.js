const { expect } = require('chai');
const sinon = require('sinon');
const salesProductsServices = require('../../../services/salesProductsServices');
const salesProductsController = require('../../../controllers/salesProductsController');

describe('Test Controller sales_products', () => {
  beforeEach(sinon.restore);

  const FAKE_SALES_PRODUCTS = [{ saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 }, { saleId: 2, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 }];
  const FAKE_SALES = [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 20 }];

  describe('Ao listar todas as vendas', () => {
    it('Se sucesso deve retornar status 200', async () => {
      sinon.stub(salesProductsServices, 'getAll').resolves(FAKE_SALES_PRODUCTS);
      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getAll(req, res);
      expect(res.status.calledWith(201)).to.be.false;
    });
  });

  describe('Ao listar uma venda especifica', () => {
    it('Se sucesso deve retornar o status 201', async () => {
      sinon.stub(salesProductsServices, 'getById').resolves({ code: 201, data: FAKE_SALES_PRODUCTS[0] });
      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getById(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Caso a venda nao existe deve retornar a mensagem "Sales not found" e status 404', async () => {
      sinon.stub(salesProductsServices, 'getById').resolves({ code: 404, message: 'Sale not found' });
      const req = { id: 999999 };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.getById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('Ao criar uma venda', () => {
    const FAKE_DATA = { id: 1, itemsSold: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }] };
    const FAKE_SALES_CREATE = [
      {
        "productId": 1,
        "quantity": 1
      },
      {
        "productId": 2,
        "quantity": 5
      }
    ]

    it('se sucesso deve retornar status 201', async () => {
      sinon.stub(salesProductsServices, 'create').resolves({ code: 201, data: FAKE_DATA });
      const req = { body: FAKE_SALES_CREATE };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.create(req, res);
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('Caso message não seja undefined deve retorar o mesmo com seu status de erro ', async () => {
      sinon.stub(salesProductsServices, 'create').resolves({ code: 400, message: 'error' });
      const req = { body: {} };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);

      await salesProductsController.create(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    })
  });

  describe('Ao atualizar uma venda', () => {
    it('Se sucesso deve retornar status 201', async () => {
      sinon.stub(salesProductsServices, 'update').resolves({ code: 201, data: { saleId: 1, itemsUpdated: FAKE_SALES } });
      const req = { params: { id: 1 }, body: FAKE_SALES };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.update(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ saleId: 1, itemsUpdated: FAKE_SALES })).to.be.true;
    });

    it('Caso "message" não seja undefind deve retornar o mesmo com seu status de erro', async () => {
      sinon.stub(salesProductsServices, 'update').resolves({ code: 400, message: 'error' });
      const req = { params: { id: undefined }, body: undefined };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);

      await salesProductsController.update(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('Ao deletar uma venda', () => {
    it('Se sucesso deve retornar apenas o status 201', async () => {
      sinon.stub(salesProductsServices, 'deleteSale').resolves({ code: 201 });
      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.end = sinon.stub().returns(res);
      await salesProductsController.deleteSale(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.end.called).to.be.true;
    });

    it('Caso a venda não exista deve retornar a mensagem "Sales not found" e status 404', async () => {
      sinon.stub(salesProductsServices, 'deleteSale').resolves({ code: 404, message: 'Sale not found' });
      const req = { params: { id: 999999 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      await salesProductsController.deleteSale(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Sale not found' })).to.be.true;
    });
  });
});