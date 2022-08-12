const { expect } = require('chai');
const sinon = require('sinon');
const productModels = require('../../../models/productModels');
const connection = require('../../../models/connection');

describe('Test Model products', () => {
  beforeEach(sinon.restore);

  describe('Testa ao procurar os produtos', () => {
    const FAKE_PRODUCTS = [
      { id: 1, name: 'Baby yoda' }, { id: 2, name: 'Darth vader' }, { id: 3, name: 'Luke skywalker' },
    ];
    const FAKE_PRODUCT = { id: 1, name: 'Baby yoda' };
    it('Deve retornar todos os produtos', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_PRODUCTS]);
      const getProducts = await productModels.getAll();
      expect(getProducts).to.be.eql(FAKE_PRODUCTS);
      getProducts.map((product) => expect(product).to.be.all.keys('id', 'name'));
    });
    it('Deve retornar o produto especifico', async () => {
      sinon.stub(connection, 'execute').resolves([FAKE_PRODUCT]);
      const getProduct = await productModels.getById(1);
      expect(getProduct).to.be.all.keys('id', 'name');
      expect(getProduct.id).to.be.equal(1);
      expect(getProduct.name).to.be.equal('Baby yoda');
    });
  });
  describe('Testa ao procurar por um produto', () => {
  });
});