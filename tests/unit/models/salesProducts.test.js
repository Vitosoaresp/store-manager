const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesProductsModels = require('../../../models/salesProductsModels');
const salesModels = require('../../../models/salesModels');

describe('Test Model Sales_Products e sales', () => {
  beforeEach(sinon.restore);

  const FAKE_SALES_PRODUCTS = [
    {
      "saleId": 1,
      "date": "2021-09-09T04:54:29.000Z",
      "productId": 1,
      "quantity": 2
    },
    {
      "saleId": 2,
      "date": "2021-09-09T04:54:54.000Z",
      "productId": 2,
      "quantity": 2
    }
  ];
  const FAKE_SALES = { saleId: 1, productId: 1, quantity: 1 };


  describe('Ao listar todas as vendas', () => {
    it('Deve retornar todas as vendas', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_SALES_PRODUCTS]);
      const getSales = await salesProductsModels.getAll();
      expect(getSales).to.be.an('array');
      expect(getSales[0]).to.be.have.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });

  describe('Ao listar uma venda', () => {
    it('Deve retornar uma venda com os atributos "saleId, date, productId e quantity"', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_SALES_PRODUCTS[0]]);
      const getSale = await salesProductsModels.getById({ id: 1 });
      expect(getSale).to.be.have.all.keys('saleId', 'date', 'productId', 'quantity');
      expect(getSale.saleId).to.be.equal(1);
      expect(getSale.date).to.be.equal('2021-09-09T04:54:29.000Z');
      expect(getSale.productId).to.be.equal(1);
      expect(getSale.quantity).to.be.equal(2);
    });
    it('Deve retornar uma venda com os atributos "id, date"', async () => {
      sinon.stub(connection, 'execute').resolves([{ id: 1, date: '2021-09-09T04:54:29.000Z' }]);
      const getSale = await salesModels.getById({ id: 1 });
      expect(getSale).to.be.have.all.keys('id', 'date');
      expect(getSale.id).to.be.equal(1);
      expect(getSale.date).to.be.equal('2021-09-09T04:54:29.000Z');
    });
  });

  describe('Ao criar uma venda', () => {
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

  describe('Ao atualizar uma venda', () => {
    it('Se sucesso deve retornar true', async () => {
      sinon.stub(connection, 'execute').resolves();
      const updateSales = await salesProductsModels.update(FAKE_SALES);
      expect(updateSales).to.be.true;
    });
  });

  describe('Ao deletar uma venda', () => {
    it('Deve retornar true', async () => {
      sinon.stub(connection, 'execute').resolves(true);
      const deleteSale = await salesModels.deleteSale({ id: 1 });
      expect(deleteSale).to.be.true;
    });
  });
});