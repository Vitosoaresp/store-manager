const { expect } = require('chai');
const sinon = require('sinon');
const salesProductsServices = require('../../../services/salesProductsServices');
const salesModels = require('../../../models/salesModels');
const salesProductsModels = require('../../../models/salesProductsModels');
const productServices = require('../../../services/productServices');

describe('Test Services sales_products', () => {
  beforeEach(sinon.restore);

  describe('Ao criar uma venda', () => {
    const FAKE_SALES = [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }];
    const FAKE_SALES_WHITHOUT_PRODUCT_ID = [{ productId: 1, quantity: 1 }, { quantity: 2 }];
    const FAKE_SALES_WHITHOUT_QUANTITY = [{ productId: 1, quantity: 1 }, { productId: 2 }];
    const FAKE_SALES_QUANTITY_LESS_THAN_1 = [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 0 }];
    const FAKE_INSERT_ID = 1;
    const FAKE_PRODUCT = { id: 1, name: 'Product 1' };
    const PRODUCT_NOT_FOUND = { code: 404, message: 'Product not found' };
    const PRODUCT_ID_IS_REQUIRED = { code: 400, message: '"productId" is required' };
    const QUANTITY_IS_REQUIRED = { code: 400, message: '"quantity" is required' };
    const QUANTITY_LESS_THAN_1 = { code: 422, message: '"quantity" must be greater than or equal to 1' };

    it('se sucesso deve retornar a venda', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves();
      sinon.stub(productServices, 'getById').resolves({ code: 200, data: FAKE_PRODUCT });

      const { data, message } = await salesProductsServices.create(FAKE_SALES);
      expect(message).to.be.a.undefined;
      expect(data).to.be.have.keys('id', 'itemsSold');
      expect(data.id).to.equal(FAKE_INSERT_ID);
    });

    it('Testa se caso o produto não exista deve retornar erro', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves();
      sinon.stub(productServices, 'getById').resolves(PRODUCT_NOT_FOUND);

      const { data, message } = await salesProductsServices.create(FAKE_SALES);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('Product not found');
    });

    it('Testa se caso não passe um id do produto deve retornar erro', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(PRODUCT_ID_IS_REQUIRED);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_WHITHOUT_PRODUCT_ID);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"productId" is required');
    });

    it('Testa se caso não passe uma quantidade deve retornar erro', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(QUANTITY_IS_REQUIRED);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_WHITHOUT_QUANTITY);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" is required');
    });

    it('Testa se caso a quantidade seja menor que 1 deve retornar erro', async () => {
      sinon.stub(salesModels, 'create').resolves(FAKE_INSERT_ID);
      sinon.stub(salesProductsModels, 'create').resolves(QUANTITY_LESS_THAN_1);

      const { data, message } = await salesProductsServices.create(FAKE_SALES_QUANTITY_LESS_THAN_1);
      expect(data).to.be.a.undefined;
      expect(message).to.equal('"quantity" must be greater than or equal to 1');
    });
  });
});