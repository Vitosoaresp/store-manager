const { expect } = require('chai');
const sinon = require('sinon');
const salesProductsServices = require('../../../services/salesProductsServices');
const salesModels = require('../../../models/salesModels');
const salesProductsModels = require('../../../models/salesProductsModels');
const productServices = require('../../../services/productServices');

describe('Test Services sales_products', () => {
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
  const FAKE_SALES = [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }];
  const FAKE_SALES_WHITHOUT_PRODUCT_ID = [{ productId: 1, quantity: 1 }, { quantity: 2 }];
  const FAKE_SALES_WHITHOUT_QUANTITY = [{ productId: 1, quantity: 1 }, { productId: 2 }];
  const FAKE_SALES_QUANTITY_LESS_THAN_1 = [{ productId: 1, quantity: -1 }, { productId: 2, quantity: 0 }];
  const FAKE_SALES_UPDATE = [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 20 }];
  const SALES_UNDEFINED = [{ productId: 1, quantity: 1 }, undefined, undefined];
  const FAKE_INSERT_ID = 1;
  const FAKE_PRODUCT = { id: 1, name: 'Product 1' };
  const PRODUCT_NOT_FOUND = { code: 404, message: 'Product not found' };
  const PRODUCT_ID_IS_REQUIRED = { code: 400, message: '"productId" is required' };
  const QUANTITY_IS_REQUIRED = { code: 400, message: '"quantity" is required' };
  const QUANTITY_LESS_THAN_1 = { code: 422, message: '"quantity" must be greater than or equal to 1' };

  describe('Ao listar as vendas', () => {
    it('Deve retornar todas as vendas', async () => {
      sinon.stub(salesProductsModels, 'getAll').resolves(FAKE_SALES_PRODUCTS);
      const { data } = await salesProductsServices.getAll();
      expect(data).to.be.an('array');
      expect(data[0]).to.be.have.all.keys('saleId', 'date', 'productId', 'quantity');
    })
  });

  describe('Ao listar uma venda especifica', () => {
    it('Se sucesso deve retornar a venda especifica', async () => {
      sinon.stub(salesProductsModels, 'getById').resolves(FAKE_SALES_PRODUCTS[0]);
      const { data, message } = await salesProductsServices.getById(1);
      expect(data).to.be.have.all.keys('saleId', 'date', 'productId', 'quantity');
      expect(data.saleId).to.be.equal(1);
      expect(data.date).to.be.equal('2021-09-09T04:54:29.000Z');
      expect(data.productId).to.be.equal(1);
      expect(data.quantity).to.be.equal(2);
      expect(message).to.be.undefined;
    });
    it('Se não encontrar a venda especifica deve retornar uma mensagem "Sale not found"', async () => {
      sinon.stub(salesProductsModels, 'getById').resolves([]);
      const { message, data } = await salesProductsServices.getById(1);
      expect(message).to.be.equal('Sale not found');
      expect(data).to.be.undefined;
    });
  });

  describe('Ao criar uma venda', () => {
    it('se sucesso deve retornar a venda', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves();
      sinon.stub(productServices, 'getById').resolves({ code: 200, data: FAKE_PRODUCT });

      const { data, message } = await salesProductsServices.create(FAKE_SALES);
      expect(message).to.be.a.undefined;
      expect(data).to.be.have.keys('id', 'itemsSold');
      expect(data.id).to.equal(FAKE_INSERT_ID);
    });

    it('Caso o produto não exista deve retornar a mensagem "Product not found"', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves();
      sinon.stub(productServices, 'getById').resolves(PRODUCT_NOT_FOUND);

      const { data, message } = await salesProductsServices.create(FAKE_SALES);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('Product not found');
    });

    it('Caso não passe um id do produto deve retornar a mensagem "productId is required"', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(PRODUCT_ID_IS_REQUIRED);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_WHITHOUT_PRODUCT_ID);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"productId" is required');
    });

    it('Caso não passe uma quantidade deve retornar a mensagem "quantity is required"', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(QUANTITY_IS_REQUIRED);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_WHITHOUT_QUANTITY);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" is required');
    });

    it('Caso a quantidade seja menor que 1 deve retornar a mensagem "quantity must be greater than or equal to 1"', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(QUANTITY_LESS_THAN_1);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_QUANTITY_LESS_THAN_1);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" must be greater than or equal to 1');
    });
  });

  describe('Ao atualizar uma venda', () => {
    it('Se sucesso deve retornar a venda atualizada', async () => {
      sinon.stub(productServices, 'getById').resolves({ code: 200, data: [FAKE_PRODUCT] });
      sinon.stub(salesProductsModels, 'getById').resolves(FAKE_SALES_PRODUCTS);
      sinon.stub(salesProductsModels, 'update').resolves();
      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_UPDATE);
      expect(data).to.be.have.all.keys('saleId', 'itemsUpdated');
      expect(data.saleId).to.be.equal(1);
      expect(data.itemsUpdated).to.be.an('array');
      expect(message).to.be.undefined;
      expect(code).to.be.a.not.undefined;
    });

    it('Caso a venda não exista deve retornar a message "Sale not found', async () => {
      sinon.stub(productServices, 'getById').resolves({ code: 200, data: [FAKE_PRODUCT] });
      sinon.stub(salesProductsModels, 'getById').resolves([]);

      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_UPDATE);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('Sale not found');
      expect(code).to.be.a.not.undefined;
    });

    it('Caso o produto não exista deve retornar a mensagem "Product not found"', async () => {
      sinon.stub(productServices, 'getById').resolves(SALES_UNDEFINED);

      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_UPDATE);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('Product not found');
      expect(code).to.be.not.a.undefined;
    });

    it('Caso não passe um id do produto deve retornar a mensagem "productId is required"', async () => {
      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_WHITHOUT_PRODUCT_ID);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"productId" is required');
      expect(code).to.be.not.a.undefined;
    });

    it('Caso não passe uma quantidade deve retornar a mensagem "quantity is required"', async () => {
      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_WHITHOUT_QUANTITY);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" is required');
      expect(code).to.be.not.a.undefined;
    });

    it('Caso a quantity seja menor que 1 deve retornar a mensagem "quantity must be greater than or equal to 1"', async () => {
      const { data, message, code } = await salesProductsServices.update({ id: 1 }, FAKE_SALES_QUANTITY_LESS_THAN_1);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" must be greater than or equal to 1');
      expect(code).to.be.not.a.undefined;
    });
  });

  describe('Ao deletar uma venda', () => {
    const FAKE_SALE_DELETE = [{ productId: 1, quantity: 1 }];
    it('Se sucesso deve retornar somente o "code"', async () => {
      sinon.stub(salesModels, 'getById').resolves(FAKE_SALE_DELETE);
      sinon.stub(salesModels, 'deleteSale').resolves();
      const { code, message } = await salesProductsServices.deleteSale({ id: 1 });
      expect(message).to.be.a.undefined;
      expect(code).to.be.not.undefined;
    });

    it('Caso a venda não exista deve retornar a mensagem "Sale not found"', async () => {
      sinon.stub(salesModels, 'getById').resolves([]);
      sinon.stub(salesModels, 'deleteSale').resolves();
      const { code, message } = await salesProductsServices.deleteSale({ id: 99999 });
      expect(message).to.equal('Sale not found');
      expect(code).to.be.not.undefined;
    });
  });
});